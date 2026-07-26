"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
};

type GalleryImage = {
  id: string;
  image_url: string;
  sort_order: number;
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

const [stock, setStock] = useState("");

const [featured, setFeatured] = useState(false);

const [active, setActive] = useState(true);

const [imagePreview, setImagePreview] = useState("");

const [imageFile, setImageFile] = useState<File | null>(null);

const [gallery, setGallery] = useState<GalleryImage[]>([]);

const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

const [showVariantManager, setShowVariantManager] = useState(false);

const [showAddOption, setShowAddOption] = useState(false);

const [optionName, setOptionName] = useState("");

  const [slugEdited, setSlugEdited] = useState(true);

  useEffect(() => {
    if (!id) return;

    loadCategories();
loadProduct();
loadGallery();
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

    setCategoryId(data.category_id);

setName(data.name);

setSlug(data.slug);

setSku(data.sku || "");

setShortDescription(data.short_description || "");

setDescription(data.description || "");

setPrice(String(data.price));

setSalePrice(String(data.sale_price ?? ""));

setStock(String(data.stock));

setFeatured(data.featured);

setActive(data.active);

setImagePreview(data.image_url || "");

    setSlugEdited(true);
  }

async function moveGalleryUp(img: GalleryImage) {

  const previous = gallery.find(
    x => x.sort_order === img.sort_order - 1
  );

  if (!previous) return;

  await supabase
    .from("product_images")
    .update({
      sort_order: img.sort_order
    })
    .eq("id", previous.id);

  await supabase
    .from("product_images")
    .update({
      sort_order: img.sort_order - 1
    })
    .eq("id", img.id);

  loadGallery();

}

async function moveGalleryDown(img: GalleryImage) {

  const next = gallery.find(
    x => x.sort_order === img.sort_order + 1
  );

  if (!next) return;

  await supabase
    .from("product_images")
    .update({
      sort_order: img.sort_order
    })
    .eq("id", next.id);

  await supabase
    .from("product_images")
    .update({
      sort_order: img.sort_order + 1
    })
    .eq("id", img.id);

  loadGallery();

}

async function deleteGalleryImage(imageId: string) {

  if (!confirm("Delete this image?")) return;

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) {

    alert(error.message);

    return;

  }

  loadGallery();

}

  async function loadGallery() {

  const { data } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("sort_order");

  if (data) {

    setGallery(data);

  }

}

  async function updateProduct() {
  if (!categoryId || !name || !slug) {
    alert("Please fill all required fields.");
    return;
  }

  let imageUrl = imagePreview;

  // Upload new main image if selected
  if (imageFile) {
    const ext = imageFile.name.split(".").pop();

    const fileName =
      `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } =
      await supabase.storage
        .from("products")
        .upload(fileName, imageFile);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    imageUrl =
      supabase.storage
        .from("products")
        .getPublicUrl(fileName)
        .data.publicUrl;
  }

  // Update product
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
      image_url: imageUrl,
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  // Upload new gallery images

if (galleryFiles.length > 0) {

  for (let i = 0; i < galleryFiles.length; i++) {

    const file = galleryFiles[i];

    const ext = file.name.split(".").pop();

    const fileName =
      `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } =
      await supabase.storage
        .from("products")
        .upload(fileName, file);

    if (uploadError) continue;

    const imageUrl =
      supabase.storage
        .from("products")
        .getPublicUrl(fileName)
        .data.publicUrl;

    await supabase
      .from("product_images")
      .insert({
        product_id: id,
        image_url: imageUrl,
        sort_order: gallery.length + i,
      });

  }

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

        {imagePreview && (

  <div>

    <label className="font-semibold block mb-2">
      Current Main Image
    </label>

    <img
      src={imagePreview}
      alt=""
      className="w-40 h-40 rounded border object-cover"
    />

  </div>

)}

<div>

  <label className="font-semibold block mb-2">
    Change Main Image
  </label>

  <input
    type="file"
    accept="image/*"
    className="border p-2 w-full rounded"
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

  <label className="font-semibold block mb-3">

    Product Gallery

  </label>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

    {gallery.map((img) => (

      <div
  key={img.id}
  className="relative border rounded overflow-hidden"
>

        <img
  src={img.image_url}
  className="w-full h-28 object-cover"
/>

<div className="absolute top-2 right-2 flex gap-1">

<button
  type="button"
  onClick={() => moveGalleryUp(img)}
  className="bg-blue-600 text-white w-6 h-6 rounded text-xs"
>
  ↑
</button>

<button
  type="button"
  onClick={() => moveGalleryDown(img)}
  className="bg-green-600 text-white w-6 h-6 rounded text-xs"
>
  ↓
</button>

<button
  type="button"
  onClick={() => deleteGalleryImage(img.id)}
  className="bg-red-600 text-white w-6 h-6 rounded text-xs"
>
  ×
</button>

</div>

      </div>

    ))}

  </div>

</div>

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

        <div>

  <label className="font-semibold block mb-2">

    Add More Gallery Images

  </label>

  <input
    multiple
    type="file"
    accept="image/*"
    className="border p-2 w-full rounded"
    onChange={(e) => {

      const files = Array.from(
        e.target.files || []
      );

      setGalleryFiles(files);

      setGalleryPreviews(

        files.map(file =>
          URL.createObjectURL(file)
        )

      );

    }}
  />

</div>

{galleryPreviews.length > 0 && (

<div className="grid grid-cols-4 gap-3">

{galleryPreviews.map((img, i)=>(

<img
key={i}
src={img}
className="w-full h-28 rounded border object-cover"
/>

))}

</div>

)}

        <hr className="my-8" />

<h2 className="text-xl font-bold">
  Product Variants
</h2>

<div className="border rounded p-5 space-y-4">

  <button
  className="bg-purple-600 text-white px-4 py-2 rounded"
  onClick={() =>
    setShowVariantManager(!showVariantManager)
  }
>
  {showVariantManager
    ? "Hide Variant Manager"
    : "Manage Variants"}
</button>

{showVariantManager && (

<div className="mt-6 rounded-lg border p-5 space-y-5">

<h3 className="text-lg font-semibold">

Variant Manager

</h3>

<p className="text-gray-400">

No options added yet.

</p>

<button
className="bg-green-600 text-white px-4 py-2 rounded"
onClick={() =>
setShowAddOption(!showAddOption)
}
>

{showAddOption
? "Cancel"
: "+ Add Option"}

</button>

{showAddOption && (

<div className="border rounded p-4 mt-4 space-y-3">

<input
type="text"
placeholder="Option Name (Color, Size...)"
value={optionName}
onChange={(e)=>
setOptionName(e.target.value)
}
className="border p-2 rounded w-full"
/>

<button
className="bg-blue-600 text-white px-4 py-2 rounded"
>

Save Option

</button>

</div>

)}

</div>

)}

</div>

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