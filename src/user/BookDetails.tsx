import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getBookById, updateBook, deleteBook, addPageToBook, updatePage, deletePage, reorderPages, createBook, uploadPageImage, deletePageImage, massUploadPages, deleteAllPages, BookResponse, PageResponse } from '@util/APIUtils';
import { CLOUDINARY_BASE_URL } from '@constants'; // Import CLOUDINARY_BASE_URL from constants
import { Edit, Save, X, PlusCircle, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Upload, ImageOff, Files } from 'lucide-react'; // Added Files icon

interface BookDetailsFormData {
  languageIso: string;
  title: string;
  subtitle: string;
  authorName: string;
  description: string;
  keywords: string;
  coverImageFilename: string;
}

interface PageDetailsFormData {
  pageNumber: number;
  imageFilename: string;
  description: string;
}

interface BookDetailsProps {
  setPageActionLoading: (isLoading: boolean) => void; // New prop to control global page action loading
}

const BookDetails: React.FC<BookDetailsProps> = ({ setPageActionLoading }) => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const isNewBook = bookId === undefined || bookId === 'new';

  const [book, setBook] = useState<BookResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Keep local loading for data fetch
  const [isEditingBook, setIsEditingBook] = useState(isNewBook); // Start in edit mode if it's a new book
  const [bookFormData, setBookFormData] = useState<BookDetailsFormData>({
    languageIso: 'en', // Default language
    title: '',
    subtitle: '',
    authorName: '',
    description: '',
    keywords: '',
    coverImageFilename: '',
  });

  const [isEditingPage, setIsEditingPage] = useState<number | null>(null); // ID of the page being edited
  const [pageFormData, setPageFormData] = useState<PageDetailsFormData>({
    pageNumber: 0,
    imageFilename: '',
    description: '',
  });
  // Removed local isPageLoading state, now using setPageActionLoading from props
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for single file input
  const massFileInputRef = useRef<HTMLInputElement>(null); // Ref for mass file input

  const fetchBookDetails = useCallback(async () => {
    if (isNewBook) {
      setIsLoading(false); // No need to fetch for a new book
      return;
    }
    setIsLoading(true);
    try {
      const fetchedBook = await getBookById(Number(bookId));
      setBook(fetchedBook);
      setBookFormData({
        languageIso: fetchedBook.languageIso,
        title: fetchedBook.title,
        subtitle: fetchedBook.subtitle || '',
        authorName: fetchedBook.authorName || '',
        description: fetchedBook.description || '',
        keywords: fetchedBook.keywords || '',
        coverImageFilename: fetchedBook.coverImageFilename || '',
      });
    } catch (error: any) {
      console.error('Failed to fetch book details:', error);
      toast.error(error.message || t('book.fetch.error'), { autoClose: 5000 });
      navigate('/bookshelf', { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [bookId, isNewBook, navigate, t]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  const handleBookFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Use local isLoading for this action
    try {
      let resultBook: BookResponse;
      if (isNewBook) {
        resultBook = await createBook(bookFormData);
        toast.success(t('book.create.success'), { autoClose: 3000 });
        navigate(`/books/${resultBook.id}`, { replace: true }); // Navigate to new book's detail page
      } else {
        if (!bookId) return;
        resultBook = await updateBook(Number(bookId), bookFormData);
        toast.success(t('book.update.success'), { autoClose: 3000 });
      }
      setBook(resultBook);
      setIsEditingBook(false);
    } catch (error: any) {
      console.error('Failed to save book:', error);
      toast.error(error.message || (isNewBook ? t('book.create.error') : t('book.update.error')), { autoClose: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEditBook = () => {
    if (isNewBook) {
      navigate('/bookshelf'); // Go back to bookshelf if cancelling new book creation
    } else if (book) {
      setBookFormData({
        languageIso: book.languageIso,
        title: book.title,
        subtitle: book.subtitle || '',
        authorName: book.authorName || '',
        description: book.description || '',
        keywords: book.keywords || '',
        coverImageFilename: book.coverImageFilename || '',
      });
      setIsEditingBook(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!bookId) return;
    if (window.confirm(t('confirm_delete_book'))) {
      setIsLoading(true); // Use local isLoading for this action
      try {
        await deleteBook(Number(bookId));
        toast.success(t('book.delete.success'), { autoClose: 3000 });
        navigate('/bookshelf');
      } catch (error: any) {
        console.error('Failed to delete book:', error);
        toast.error(error.message || t('book.delete.error'), { autoClose: 5000 });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddPage = async () => {
    if (!bookId) return;
    setPageActionLoading(true); // Activate global loader
    try {
      // Page number will be assigned by backend
      await addPageToBook(Number(bookId), { pageNumber: 0, imageFilename: '', description: '' });
      toast.success(t('page.create.success'), { autoClose: 3000 });
      await fetchBookDetails(); // Re-fetch book to get updated pages
    } catch (error: any) {
      console.error('Failed to add page:', error);
      toast.error(error.message || t('page.create.error'), { autoClose: 5000 });
    } finally {
      setPageActionLoading(false); // Deactivate global loader
    }
  };

  const handleEditPage = (page: PageResponse) => {
    setIsEditingPage(page.id);
    setPageFormData({
      pageNumber: page.pageNumber,
      imageFilename: page.imageFilename || '',
      description: page.description || '',
    });
  };

  const handlePageFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePage = async (pageId: number) => {
    if (!bookId) return;
    setPageActionLoading(true); // Activate global loader
    try {
      await updatePage(Number(bookId), pageId, pageFormData);
      toast.success(t('page.update.success'), { autoClose: 3000 });
      setIsEditingPage(null);
      await fetchBookDetails();
    } catch (error: any) {
      console.error('Failed to update page:', error);
      toast.error(error.message || t('page.update.error'), { autoClose: 5000 });
    } finally {
      setPageActionLoading(false); // Deactivate global loader
    }
  };

  const handleCancelEditPage = (originalPage: PageResponse) => {
    setIsEditingPage(null);
    setPageFormData({
      pageNumber: originalPage.pageNumber,
      imageFilename: originalPage.imageFilename || '',
      description: originalPage.description || '',
    });
  };

  const handleDeletePage = async (pageId: number) => {
    if (!bookId) return;
    if (window.confirm(t('confirm_delete_page'))) {
      setPageActionLoading(true); // Activate global loader
      try {
        await deletePage(Number(bookId), pageId);
        toast.success(t('page.delete.success'), { autoClose: 3000 });
        await fetchBookDetails();
      } catch (error: any) {
        console.error('Failed to delete page:', error);
        toast.error(error.message || t('page.delete.error'), { autoClose: 5000 });
      } finally {
        setPageActionLoading(false); // Deactivate global loader
      }
    }
  };

  const handleMovePage = async (pageId: number, oldPageNumber: number, direction: 'up' | 'down') => {
    if (!bookId || !book?.pages) return;

    const newPageNumber = direction === 'up' ? oldPageNumber - 1 : oldPageNumber + 1;

    if (newPageNumber < 1 || newPageNumber > book.pages.length) {
      toast.warn(t('page.reorder.noChange'), { autoClose: 3000 });
      return;
    }

    setPageActionLoading(true); // Activate global loader
    try {
      await reorderPages(Number(bookId), { oldPageNumber, newPageNumber });
      toast.success(t('page.reorder.success'), { autoClose: 3000 });
      await fetchBookDetails();
    } catch (error: any) {
      console.error('Failed to reorder pages:', error);
      toast.error(error.message || t('page.reorder.error'), { autoClose: 5000 });
    } finally {
      setPageActionLoading(false); // Deactivate global loader
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, pageId: number) => {
    if (!bookId || !event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setPageActionLoading(true); // Activate global loader
    try {
      const updatedPage = await uploadPageImage(Number(bookId), pageId, file);
      toast.success(t('page.image.upload.success'), { autoClose: 3000 });
      // Update the specific page in the local state
      setBook((prevBook) => {
        if (!prevBook) return null;
        const updatedPages = prevBook.pages?.map((p) =>
          p.id === pageId ? { ...p, imageFilename: updatedPage.imageFilename } : p
        );
        return { ...prevBook, pages: updatedPages };
      });
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      toast.error(error.message || t('page.image.upload.error'), { autoClose: 5000 });
    } finally {
      setPageActionLoading(false); // Deactivate global loader
      // Reset file input to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  };

  const handleDeleteImage = async (pageId: number) => {
    if (!bookId) return;
    if (window.confirm(t('confirm_delete_page_image'))) {
      setPageActionLoading(true); // Activate global loader
      try {
        await deletePageImage(Number(bookId), pageId);
        toast.success(t('page.image.delete.success'), { autoClose: 3000 });
        // Clear the image filename in the local state
        setBook((prevBook) => {
          if (!prevBook) return null;
          const updatedPages = prevBook.pages?.map((p) =>
            p.id === pageId ? { ...p, imageFilename: undefined } : p
          );
          return { ...prevBook, pages: updatedPages };
        });
      } catch (error: any) {
        console.error('Failed to delete image:', error);
        toast.error(error.message || t('page.image.delete.error'), { autoClose: 5000 });
    } finally {
        setPageActionLoading(false); // Deactivate global loader
      }
    }
  };

  const handleMassImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!bookId || !event.target.files || event.target.files.length === 0) {
      return;
    }

    const files = Array.from(event.target.files);
    setPageActionLoading(true); // Activate global loader
    try {
      await massUploadPages(Number(bookId), files);
      toast.success(t('page.massUpload.success', { count: files.length }), { autoClose: 3000 });
      await fetchBookDetails(); // Re-fetch book to get all new pages
    } catch (error: any) {
      console.error('Failed to mass upload images:', error);
      toast.error(error.message || t('page.massUpload.error'), { autoClose: 5000 });
    } finally {
      setPageActionLoading(false); // Deactivate global loader
      if (massFileInputRef.current) {
        massFileInputRef.current.value = ''; // Clear file input
      }
    }
  };

  const handleDeleteAllPages = async () => {
    if (!bookId) return;
    if (window.confirm(t('confirm_delete_all_pages'))) {
      setPageActionLoading(true); // Activate global loader
      try {
        await deleteAllPages(Number(bookId));
        toast.success(t('page.deleteAll.success'), { autoClose: 3000 });
        await fetchBookDetails(); // Re-fetch book to show no pages
      } catch (error: any) {
        console.error('Failed to delete all pages:', error);
        toast.error(error.message || t('page.deleteAll.error'), { autoClose: 5000 });
      } finally {
        setPageActionLoading(false); // Deactivate global loader
      }
    }
  };

  const handleRecreateWithAI = () => {
    toast.info(t('ai_feature_funding_message'), { autoClose: 8000 });
  };

  // The FullScreenLoader in App.tsx will handle the initial loading state
  // No need for a local `if (isLoading) return <LoadingIndicator />` here.

  if (!book && !isNewBook && !isLoading) { // Only show error if not loading and no book
    return <p className="text-center">{t('error.resourceNotFound', { resourceName: 'Book', fieldName: 'id', fieldValue: bookId })}</p>;
  }

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      <div className="row">
        <div className="col-md-10 col-md-offset-1">
          <div className="auth-card">
            <h1 className="auth-card-title" style={{ marginBottom: '20px' }}>{isNewBook ? t('add_book') : t('book_details')}</h1>

            {/* Book Details Section */}
            <div className="book-details-section" style={{ marginBottom: '40px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.5em', color: '#333' }}>{isNewBook ? t('add_book') : book?.title}</h2>
                {!isEditingBook ? (
                  <button className="btn btn-primary btn-sm" onClick={() => setIsEditingBook(true)} style={{ display: 'flex', alignItems: 'center' }}>
                    <Edit size={16} style={{ marginRight: '5px' }} /> {t('edit_book')}
                  </button>
                ) : (
                  <div>
                    <button className="btn btn-success btn-sm" onClick={handleSaveBook} disabled={isLoading} style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                      {isLoading ? t('loading') : <><Save size={16} style={{ marginRight: '5px' }} /> {t('save')}</>}
                    </button>
                    <button className="btn btn-default btn-sm" onClick={handleCancelEditBook} disabled={isLoading} style={{ display: 'flex', alignItems: 'center' }}>
                      <X size={16} style={{ marginRight: '5px' }} /> {t('cancel')}
                    </button>
                  </div>
                )}
              </div>

              {isEditingBook ? (
                <form onSubmit={handleSaveBook}>
                  <div className="form-group">
                    <label htmlFor="title">{t('book_title')}</label>
                    <input type="text" id="title" name="title" className="form-control" value={bookFormData.title} onChange={handleBookFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subtitle">{t('book_subtitle')}</label>
                    <input type="text" id="subtitle" name="subtitle" className="form-control" value={bookFormData.subtitle} onChange={handleBookFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="authorName">{t('book_author')}</label>
                    <input type="text" id="authorName" name="authorName" className="form-control" value={bookFormData.authorName} onChange={handleBookFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="languageIso">{t('book_language')}</label>
                    <select id="languageIso" name="languageIso" className="form-control" value={bookFormData.languageIso} onChange={handleBookFormChange} required>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                      <option value="it">Italiano</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">{t('book_description')}</label>
                    <textarea id="description" name="description" className="form-control" rows={5} value={bookFormData.description} onChange={handleBookFormChange}></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="keywords">{t('book_keywords')}</label>
                    <input type="text" id="keywords" name="keywords" className="form-control" value={bookFormData.keywords} onChange={handleBookFormChange} placeholder="keyword1, keyword2, keyword3" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="coverImageFilename">{t('book_cover_image')} (Cloudinary Filename)</label>
                    <input type="text" id="coverImageFilename" name="coverImageFilename" className="form-control" value={bookFormData.coverImageFilename} onChange={handleBookFormChange} placeholder="e.g., my_book_cover.jpg" />
                    <small className="form-text text-muted">{t('cloudinary_upload_note')}</small>
                  </div>
                  <div className="form-group" style={{ marginTop: '20px' }}>
                    <button type="submit" className="btn btn-success" disabled={isLoading} style={{ marginRight: '10px' }}>
                      {isLoading ? t('loading') : <><Save size={16} style={{ marginRight: '5px' }} /> {t('save')}</>}
                    </button>
                    <button type="button" className="btn btn-default" onClick={handleCancelEditBook} disabled={isLoading}>
                      <X size={16} style={{ marginRight: '5px' }} /> {t('cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p><strong>{t('book_subtitle')}:</strong> {book?.subtitle || '-'}</p>
                  <p><strong>{t('book_author')}:</strong> {book?.authorName || '-'}</p>
                  <p><strong>{t('book_language')}:</strong> {book?.languageIso.toUpperCase()}</p>
                  <p><strong>{t('book_description')}:</strong> {book?.description || '-'}</p>
                  <p><strong>{t('book_keywords')}:</strong> {book?.keywords || '-'}</p>
                  {book?.coverImageFilename && (
                    <div style={{ marginTop: '20px' }}>
                      <strong>{t('book_cover_image')}:</strong>
                      <img src={`${CLOUDINARY_BASE_URL}${book.coverImageFilename}`} alt={book.title} style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', marginTop: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                  )}
                  <button className="btn btn-danger" onClick={handleDeleteBook} disabled={isLoading} style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                    {isLoading ? t('loading') : <><Trash2 size={16} style={{ marginRight: '5px' }} /> {t('delete_book')}</>}
                  </button>
                </div>
              )}
            </div>

            {/* Pages Section - Only visible for existing books */}
            {!isNewBook && book && (
              <div className="pages-section" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.5em', color: '#333' }}>{t('pages')}</h2>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary btn-sm" onClick={handleAddPage} disabled={isLoading} style={{ display: 'flex', alignItems: 'center' }}>
                      {isLoading ? t('loading') : <><PlusCircle size={16} style={{ marginRight: '5px' }} /> {t('add_page')}</>}
                    </button>
                    <label htmlFor="massFileUpload" className="btn btn-info btn-sm" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: 'fit-content' }}>
                      <Files size={16} style={{ marginRight: '5px' }} /> {t('mass_upload_images')}
                    </label>
                    <input
                      type="file"
                      id="massFileUpload"
                      ref={massFileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleMassImageUpload}
                      accept="image/png, image/jpeg, image/jpg"
                      multiple
                      disabled={isLoading}
                    />
                    <button className="btn btn-danger btn-sm" onClick={handleDeleteAllPages} disabled={isLoading || (book.pages && book.pages.length === 0)} style={{ display: 'flex', alignItems: 'center' }}>
                      {isLoading ? t('loading') : <><Trash2 size={16} style={{ marginRight: '5px' }} /> {t('delete_all_pages')}</>}
                    </button>
                  </div>
                </div>

                {isLoading ? ( // Use local isLoading for content within the page
                  <p className="text-center">{t('loading')}...</p>
                ) : book.pages && book.pages.length > 0 ? (
                  <div className="page-list" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    {book.pages.map((page) => (
                      <div key={page.id} className="page-card" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h4 style={{ margin: 0, fontSize: '1.1em', color: '#555' }}>{t('page_number')}: {page.pageNumber}</h4>
                          <div className="page-actions" style={{ display: 'flex', gap: '5px' }}>
                            <button
                              className="btn btn-default btn-sm"
                              onClick={() => handleMovePage(page.id, page.pageNumber, 'up')}
                              disabled={page.pageNumber === 1 || isLoading}
                              title={t('move_page_up')}
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button
                              className="btn btn-default btn-sm"
                              onClick={() => handleMovePage(page.id, page.pageNumber, 'down')}
                              disabled={page.pageNumber === book.pages.length || isLoading}
                              title={t('move_page_down')}
                            >
                              <ChevronDown size={16} />
                            </button>
                            {isEditingPage === page.id ? (
                              <>
                                <button className="btn btn-success btn-sm" onClick={() => handleSavePage(page.id)} disabled={isLoading} title={t('save')}>
                                  {isLoading ? t('loading') : <Save size={16} />}
                                </button>
                                <button className="btn btn-default btn-sm" onClick={() => handleCancelEditPage(page)} disabled={isLoading} title={t('cancel')}>
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <button className="btn btn-primary btn-sm" onClick={() => handleEditPage(page)} title={t('edit_page')}>
                                <Edit size={16} />
                              </button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeletePage(page.id)} disabled={isLoading} title={t('delete_page')}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {isEditingPage === page.id ? (
                          <form>
                            <div className="form-group">
                              <label htmlFor={`pageDescription-${page.id}`}>{t('page_description')}</label>
                              <textarea id={`pageDescription-${page.id}`} name="description" className="form-control" rows={3} value={pageFormData.description} onChange={handlePageFormChange}></textarea>
                            </div>
                            <div className="form-group">
                              <label htmlFor={`pageImageFilename-${page.id}`}>{t('page_image')} (Cloudinary Filename)</label>
                              <input type="text" id={`pageImageFilename-${page.id}`} name="imageFilename" className="form-control" value={pageFormData.imageFilename} readOnly /> {/* Made readOnly */}
                              <small className="form-text text-muted">{t('cloudinary_upload_note')}</small>
                            </div>
                            <div className="form-group" style={{ marginTop: '15px' }}>
                                <label htmlFor={`fileUpload-${page.id}`} className="btn btn-success btn-sm" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: 'fit-content' }}> {/* Changed to btn-success */}
                                    {isLoading ? t('loading') : <><Upload size={16} style={{ marginRight: '5px' }} /> {t('upload_image')}</>}
                                </label>
                                <input
                                    type="file"
                                    id={`fileUpload-${page.id}`}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(e, page.id)}
                                    accept="image/png, image/jpeg, image/jpg"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '15px' }}>
                              <button type="button" className="btn btn-primary btn-sm" onClick={handleRecreateWithAI} disabled={isLoading} style={{ display: 'flex', alignItems: 'center' }}> {/* Changed to btn-primary */}
                                {isLoading ? t('loading') : <><ImageIcon size={16} style={{ marginRight: '5px' }} /> {t('create_image')}</>}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <p><strong>{t('page_description')}:</strong> {page.description || '-'}</p>
                            <div className="canvas-container" style={{ border: '1px dashed #ccc', padding: '20px', marginTop: '15px', minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                              {page.imageFilename ? (
                                <>
                                  <img src={`${CLOUDINARY_BASE_URL}${page.imageFilename}`} alt={`Page ${page.pageNumber}`} style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteImage(page.id)} disabled={isLoading} style={{ display: 'flex', alignItems: 'center' }}>
                                    {isLoading ? t('loading') : <><ImageOff size={16} style={{ marginRight: '5px' }} /> {t('delete_page_image')}</>}
                                  </button>
                                </>
                              ) : (
                                <p className="text-muted">{t('canvas_container')}</p>
                              )}
                            </div>
                            {/* Upload and AI buttons always visible in view mode */}
                            <div className="form-group" style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <label htmlFor={`fileUpload-${page.id}-view`} className="btn btn-success btn-sm" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: 'fit-content' }}> {/* Changed to btn-success */}
                                    {isLoading ? t('loading') : <><Upload size={16} style={{ marginRight: '5px' }} /> {t('upload_image')}</>}
                                </label>
                                <input
                                    type="file"
                                    id={`fileUpload-${page.id}-view`}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(e, page.id)}
                                    accept="image/png, image/jpeg, image/jpg"
                                    disabled={isLoading}
                                />
                                <button type="button" className="btn btn-primary btn-sm" onClick={handleRecreateWithAI} disabled={isLoading} style={{ display: 'flex', alignItems: 'center' }}> {/* Changed to btn-primary */}
                                  {isLoading ? t('loading') : <><ImageIcon size={16} style={{ marginRight: '5px' }} /> {t('create_image')}</>}
                                </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">{t('no_pages_found')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;