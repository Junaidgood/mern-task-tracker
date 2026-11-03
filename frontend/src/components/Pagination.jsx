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
        ← Previous
      </button>

      {/* Page numbers info */}
      <span>
        Page {page} of {totalPages} ({totalTasks} tasks)
      </span>

      {/* Next button */}
      <button
        type="button"
        className="btn-page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </footer>
  );
}

export default Pagination;
