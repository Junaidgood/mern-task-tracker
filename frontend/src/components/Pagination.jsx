import '../styles/Pagination.css';

/**
 * -------------------------------------------------------------
 * Pagination.jsx (Pages Switch Karne Ka Component)
 * -------------------------------------------------------------
 * FLOW:
 * Step 1: Agar koi task na ho to pagination chup jata hai.
 * Step 2: "Previous" button dabane par pichla page khulta hai.
 * Step 3: Current page aur total tasks count dikhata hai.
 * Step 4: "Next" button dabane par agla page khulta hai.
 * -------------------------------------------------------------
 */
function Pagination({ page, totalPages, totalTasks, onPageChange }) {
  // Tasks nahi hain to kuch na dikhao
  if (totalTasks === 0) return null;

  return (
    <footer className="pagination">
      {/* Previous button */}
      <button
        type="button"
        className="btn-page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Previous</span>
      </button>

      {/* Page numbers info badge */}
      <span className="pagination-info">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong> • <strong>{totalTasks}</strong> tasks
      </span>

      {/* Next button */}
      <button
        type="button"
        className="btn-page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <span>Next</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </footer>
  );
}

export default Pagination;
