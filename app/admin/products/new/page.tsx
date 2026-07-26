"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
};

export default function NewProductPage() {
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

  const [slugEdited, setSlugEdited] = useState(false);

  // ==========================
  // IMAGE STATES
  // ==========================

  const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState("");

const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

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

  setUploading(false);

  alert(error.message);

  return;

}

    setCategories(data || []);
  }

  // ==========================
  // UPLOAD IMAGE
  // ==========================

  async function uploadImage() {
    if (!imageFile) return "";

    setUploading(true);

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, imageFile);

    if (error) {
      setUploading(false);
      alert(error.message);
      return "";
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    setUploading(false);

    return data.publicUrl;
  }

async function uploadSingleImage(file: File) {
  const ext = file.name.split(".").pop();

  const fileName =
    `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } =
    await supabase.storage
      .from("products")
      .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data } =
    supabase.storage
      .from("products")
      .getPublicUrl(fileName);

  return data.publicUrl;
}

async function uploadGalleryImages(productId: string) {

  if (galleryFiles.length === 0) return;

  const galleryData = [];

  for (let i = 0; i < galleryFiles.length; i++) {

    const url =
      await uploadSingleImage(galleryFiles[i]);

    galleryData.push({

      product_id: productId,

      image_url: url,

      sort_order: i,

    });

  }

  const { error } =
    await supabase
      .from("product_images")
      .insert(galleryData);

  if (error) {

    throw error;

  }

}

  async function addProduct() {
    if (!categoryId || !name || !slug) {
      alert("Please fill all required fields.");
      return;
    }

    let imageUrl = "";

setUploading(true);

    if (imageFile) {
      imageUrl = await uploadImage();

      if (imageFile && !imageUrl) {
        return;
      }
    }

    const { data, error } = await supabase
  .from("products")
  .insert({
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
    image_url: imageUrl,
  })
  .select()
  .single();
    if (error) {
  alert(error.message);
  return;
}

await uploadGalleryImages(data.id);

setUploading(false);

alert("Product Added Successfully");

    setCategoryId("");
    setName("");
    setSlug("");
    setSku("");
    setShortDescription("");
    setDescription("");
    setPrice("");
    setSalePrice("");
    setStock("0");
    setFeatured(false);
    setActive(true);
    setSlugEdited(false);

    setImageFile(null);
setImagePreview("");

setGalleryFiles([]);
setGalleryPreviews([]);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Add Product
      </h1>

      <div className="space-y-4 max-w-xl">

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">
            Select Category
          </option>

          {categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 w-full rounded"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          rows={2}
          className="border p-2 w-full rounded"
          placeholder="Short Description"
          value={shortDescription}
          onChange={(e) =>
            setShortDescription(e.target.value)
          }
        />

        <textarea
          rows={5}
          className="border p-2 w-full rounded"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <input
          type="number"
          className="border p-2 w-full rounded"
          placeholder="Regular Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <input
          type="number"
          className="border p-2 w-full rounded"
          placeholder="Sale Price"
          value={salePrice}
          onChange={(e) =>
            setSalePrice(e.target.value)
          }
        />

        <input
          type="number"
          className="border p-2 w-full rounded"
          placeholder="Stock"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
        />

        <div>

  <label className="font-medium">
    Main Product Image
  </label>

  <input
    type="file"
    accept="image/*"
    className="border p-2 w-full rounded mt-2"
    onChange={(e) => {

      const file = e.target.files?.[0];

      if (!file) return;

      setImageFile(file);

      setImagePreview(
        URL.createObjectURL(file)
      );

    }}
  />

</div>

<div>

  <label className="font-medium">
    Product Gallery
  </label>

  <input
    type="file"
    multiple
    accept="image/*"
    className="border p-2 w-full rounded mt-2"
    onChange={(e) => {

      const files = Array.from(
        e.target.files || []
      );

      setGalleryFiles(files);

      setGalleryPreviews(
        files.map((file) =>
          URL.createObjectURL(file)
        )
      );

    }}
  />

</div>

        {imagePreview && (

  <img
    src={imagePreview}
    alt="Preview"
    className="w-48 h-48 object-cover rounded border"
  />

)}

{galleryPreviews.length > 0 && (

  <div className="grid grid-cols-3 gap-3 mt-4">

    {galleryPreviews.map((preview, index) => (

      <img
        key={index}
        src={preview}
        alt=""
        className="w-28 h-28 rounded object-cover border"
      />

    ))}

  </div>

)}

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={featured}
            onChange={(e) =>
              setFeatured(e.target.checked)
            }
          />

          Featured Product

        </label>

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={active}
            onChange={(e) =>
              setActive(e.target.checked)
            }
          />

          Active Product

        </label>

        <button
          disabled={uploading}
          onClick={addProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {uploading
            ? "Uploading..."
            : "Save Product"}
        </button>

      </div>

    </div>
  );
}
