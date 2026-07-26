"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("0");
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

  const [slugEdited, setSlugEdited] = useState(true);

  useEffect(() => {
    if (!id) return;

    loadCategories();
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (slugEdited) return;

    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setSlug(generatedSlug);
  }, [name, slugEdited]);

  async function loadCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id,name")
      .order("name");

    if (error) {
      alert(error.message);
      return;
    }

    setCategories(data || []);
  }

  async function loadProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setCategoryId(data.category_id || "");
    setName(data.name || "");
    setSlug(data.slug || "");
    setSku(data.sku || "");
    setShortDescription(data.short_description || "");
    setDescription(data.description || "");
    setPrice(String(data.price || ""));
    setSalePrice(String(data.sale_price || ""));
    setStock(String(data.stock || 0));
    setFeatured(data.featured ?? false);
    setActive(data.active ?? true);

    setSlugEdited(true);
  }

  async function updateProduct() {
    if (!categoryId || !name || !slug) {
      alert("Please fill all required fields.");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({
        category_id: categoryId,
        name,
        slug,
        sku,
        short_description: shortDescription,
        description,
        price: Number(price),
        sale_price: Number(salePrice || 0),
        stock: Number(stock),
        featured,
        active,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Product Updated Successfully");

    router.push("/admin/products");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <div className="space-y-4 max-w-xl">

        <select
          className="border p-2 w-full rounded"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 w-full rounded"
          placeholder="Product Name"
          value={name}
          onChange={(e) => {
            if (!slugEdited) {
              const generatedSlug = e.target.value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");

              setSlug(generatedSlug);
            }

            setName(e.target.value);
          }}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Slug"
          value={slug}
          onChange={(e) => {
            setSlugEdited(true);
            setSlug(e.target.value);
          }}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        <textarea
          className="border p-2 w-full rounded"
          rows={2}
          placeholder="Short Description"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />

        <textarea
          className="border p-2 w-full rounded"
          rows={5}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="border p-2 w-full rounded"
          type="number"
          placeholder="Regular Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="border p-2 w-full rounded"
          type="number"
          placeholder="Sale Price"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
        />

        <input
          className="border p-2 w-full rounded"
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured Product
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Active Product
        </label>

        <button
          onClick={updateProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Product
        </button>

      </div>
    </div>
  );
}