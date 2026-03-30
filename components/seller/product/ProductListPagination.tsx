import Link from "next/link";
type Props = {
  page: number;
  totalPages: number;
};

export default function ProductListPagination({ page, totalPages }: Props) {
  return (
    <div className="flex items-center gap-2 mt-4">
      {page > 1 && (
        <Link
          href={`?page=${page - 1}`}
          className="px-3 py-1 border rounded hover:bg-green-100"
        >
          Prev
        </Link>
      )}
      <span>
        {page} / {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={`?page=${page + 1}`}
          className="px-3 py-1 border rounded hover:bg-green-100"
        >
          Next
        </Link>
      )}
    </div>
  );
}
