/**
 * Pagination Component
 * Handles Next, Previous page controls and total count display
 */
function Pagination({ page, totalPages, totalTasks, onPageChange }) {
  if (totalTasks === 0) return null;

  return (
    <footer className="pagination">
      <button
        type="button"
        className="btn-page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Previous
      </button>

      <span>
        Page {page} of {totalPages} (Total: {totalTasks} tasks)
      </span>

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
