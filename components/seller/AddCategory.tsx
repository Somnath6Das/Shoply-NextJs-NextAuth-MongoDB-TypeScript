import { addMainCategory, deleteMainCategory } from "@/app/actions/category";
import Form from "next/form";

type Category = {
  _id: string;
  main: string;
  subs: string[];
};

export default function AddCategory({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-lg text-blue-700">
        Add a New Main Category
      </h3>
      <Form action={addMainCategory}>
        <div className="flex gap-2">
          <input
            type="text"
            name="main"
            placeholder="e.g. Mobile, Laptop"
            className="border rounded-md px-3 py-2 flex-1"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add Main
          </button>
        </div>
      </Form>
      {categories.length > 0 && (
        <div className="space-y-2 mt-2">
          {categories.map((cat) => (
            <Form key={cat._id} action={deleteMainCategory}>
              <div className="flex justify-between items-center bg-white border px-3 py-2 rounded-md">
                <span className="text-gray-800 font-medium">{cat.main}</span>

                <input type="hidden" name="main" value={cat.main} />
                <button type="submit" className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </Form>
          ))}
        </div>
      )}
    </div>
  );
}
