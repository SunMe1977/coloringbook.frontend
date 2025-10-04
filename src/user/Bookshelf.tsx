import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getAllBooks, deleteBook, BookResponse } from '@util/APIUtils';
import Pagination from '@components/Pagination';
import SortDropdown from '@components/SortDropdown';
import ItemsPerPageDropdown from '@components/ItemsPerPageDropdown';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';

interface BookshelfProps {
  setPageActionLoading: (isLoading: boolean) => void; // New prop to control global page action loading
}

const Bookshelf: React.FC<BookshelfProps> = ({ setPageActionLoading }) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const [books, setBooks] = useState<BookResponse[]>([]);
  // Removed local isLoading state, now using setPageActionLoading from props
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('updatedAt,desc'); // Default sort
  const [searchTerm, setSearchTerm] = useState('');
  const [totalElements, setTotalElements] = useState(0);

  const fetchBooks = useCallback(async () => {
    setPageActionLoading(true); // Activate global loader
    try {
      const response = await getAllBooks(currentPage, pageSize, sort, searchTerm);
      setBooks(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error: any) {
      console.error('Failed to fetch books:', error);
      toast.error(error.message || t('book.fetch.error'), { autoClose: 5000 });
    } finally {
      setPageActionLoading(false); // Deactivate global loader
    }
  }, [currentPage, pageSize, sort, searchTerm, t, setPageActionLoading]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page when page size changes
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(0); // Reset to first page when sort changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page on new search
    fetchBooks();
  };

  const handleDeleteBook = async (bookId: number) => {
    if (window.confirm(t('confirm_delete_book'))) {
      setPageActionLoading(true); // Activate global loader
      try {
        await deleteBook(bookId);
        toast.success(t('book.delete.success'), { autoClose: 3000 });
        await fetchBooks(); // Re-fetch books after deletion
      } catch (error: any) {
        console.error('Failed to delete book:', error);
        toast.error(error.message || t('book.delete.error'), { autoClose: 5000 });
      } finally {
        setPageActionLoading(false); // Deactivate global loader
      }
    }
  };

  const handleAddBook = () => {
    navigate('/books/new');
  };

  // The FullScreenLoader in App.tsx will handle the initial loading state
  // No need for a local `if (isLoading) return <LoadingIndicator />` here.

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      <div className="row">
        <div className="col-md-10 col-md-offset-1">
          <div className="auth-card"> {/* Using auth-card for consistent styling */}
            <h1 className="auth-card-title" style={{ marginBottom: '20px' }}>{t('bookshelf')}</h1>

            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={handleAddBook} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <PlusCircle size={20} style={{ marginRight: '8px' }} /> {t('add_book')}
              </button>

              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div className="form-group" style={{ marginBottom: '0', marginRight: '10px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('search_by_title')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ height: '34px', fontSize: '14px' }}
                  />
                </div>
                <button type="submit" className="btn btn-default" style={{ height: '34px', display: 'flex', alignItems: 'center' }}>
                  <Search size={16} />
                </button>
              </form>

              <SortDropdown currentSort={sort} onSortChange={handleSortChange} />
            </div>

            {/* Removed local isLoading check here, FullScreenLoader handles it globally */}
            {books.length === 0 ? (
              <p className="text-center">{t('no_books_found')}</p>
            ) : (
              <div className="book-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {books.map((book) => (
                  <div key={book.id} className="book-card" style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                    <div className="book-cover" style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {book.coverImageFilename ? (
                        <img
                          src={`${CLOUDINARY_BASE_URL}${book.coverImageFilename}`} // Placeholder Cloudinary URL
                          alt={book.title || t('book_cover_image')}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ color: '#888', fontSize: '1.2em' }}>{t('book_cover_image')}</span>
                      )}
                    </div>
                    <div className="book-info" style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.2em', margin: '0 0 5px 0', color: '#333' }}>{book.title}</h3>
                      {book.subtitle && <p style={{ fontSize: '0.9em', color: '#666', margin: '0 0 10px 0' }}>{book.subtitle}</p>}
                      <p style={{ fontSize: '0.8em', color: '#999', margin: '0 0 10px 0' }}>
                        {t('book_language')}: {book.languageIso.toUpperCase()} | {t('sort_updated_desc')}: {new Date(book.updatedAt).toLocaleDateString()}
                      </p>
                      <div className="book-actions" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                        <Link to={`/books/${book.id}`} className="btn btn-primary btn-sm" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Edit size={16} style={{ marginRight: '5px' }} /> {t('edit_book')}
                        </Link>
                        <button onClick={() => handleDeleteBook(book.id)} className="btn btn-danger btn-sm" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={16} style={{ marginRight: '5px' }} /> {t('delete_book')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <ItemsPerPageDropdown
                currentPageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                totalElements={totalElements}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookshelf;