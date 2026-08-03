"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

<style jsx global>{`
  select option {
    background: #111827;
    color: white;
  }

  select {
    color-scheme: dark;
  }
`}</style>

type Category = {
  id: string;
  name: string;
};

type SubCategory = {
  id: string;
  name: string;
};

type Brand = {
  id: string;
  name: string;
};

type Color = {
  id: string;
  name: string;
};

type Size = {
  id: string;
  name: string;
};

type StockStatus = {
  id: string;
  name: string;
};

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
const [brands, setBrands] = useState<Brand[]>([]);
const [colors, setColors] = useState<Color[]>([]);
const [sizes, setSizes] = useState<Size[]>([]);
const [stockStatuses, setStockStatuses] = useState<StockStatus[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
const [brandId, setBrandId] = useState("");
const [colorId, setColorId] = useState("");
const [sizeId, setSizeId] = useState("");

const [colorIds, setColorIds] = useState<string[]>([]);
const [sizeIds, setSizeIds] = useState<string[]>([]);

const [stockStatusId, setStockStatusId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

const [specification, setSpecification] =
  useState("");

  const [price, setPrice] = useState("");
const [discountPercentage, setDiscountPercentage] = useState("0");
const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("0");
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [showHero, setShowHero] = useState(false);

const [heroOrder, setHeroOrder] = useState("0");
  const [active, setActive] = useState(true);

  const [slugEdited, setSlugEdited] = useState(false);
  useEffect(() => {
  const regularPrice = Number(price);
  const discount = Number(discountPercentage);

  if (!regularPrice || discount <= 0) {
    setSalePrice("");
    return;
  }

  const sale =
    regularPrice - (regularPrice * discount) / 100;

  setSalePrice(sale.toFixed(2));
}, [price, discountPercentage]);

  // ==========================
  // IMAGE STATES
  // ==========================

  const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState("");

const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);


const [uploading, setUploading] = useState(false);
const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
  loadCategories();
  loadSubCategories();
  loadBrands();
  loadColors();
  loadSizes();
  loadStockStatuses();
}, []);

  useEffect(() => {
    if (slugEdited) return;

    const generatedSlug = name
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, "")
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-")
  .replace(/^-+|-+$/g, "");

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

async function loadSubCategories() {
  const { data } = await supabase
    .from("sub_categories")
    .select("id,name")
    .order("name");

  setSubCategories(data || []);
}

async function loadBrands() {
  const { data } = await supabase
    .from("brands")
    .select("id,name")
    .order("name");

  setBrands(data || []);
}

async function loadColors() {
  const { data } = await supabase
    .from("colors")
    .select("id,name")
    .order("name");

  setColors(data || []);
}

async function loadSizes() {
  const { data } = await supabase
    .from("sizes")
    .select("id,name")
    .order("name");

  setSizes(data || []);
}

async function loadStockStatuses() {
  const { data } = await supabase
    .from("stock_statuses")
    .select("id,name")
    .order("name");

  setStockStatuses(data || []);
}

function toggleColor(id: string) {
  setColorIds((prev) =>
    prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
  );
}

function toggleSize(id: string) {
  setSizeIds((prev) =>
    prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
  );
}

  // ==========================
  // UPLOAD IMAGE
  // ==========================

  async function uploadImage() {

  if (!imageFile) return "";

  setUploadStatus("Uploading Main Image...");

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, imageFile);

    if (error) {
      throw error;
}

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

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
  try {
    if (
  !categoryId ||
  !subCategoryId ||
  !brandId ||
  colorIds.length === 0 ||
  sizeIds.length === 0 ||
  !stockStatusId ||
  !name.trim() ||
  !slug.trim() ||
  !price
) {
      alert("Please fill all required fields.");
      return;
    }

    let imageUrl = "";

setUploading(true);
setUploadStatus("Saving Product...");

    if (imageFile) {
  setUploadStatus("Uploading Main Image...");
imageUrl = await uploadImage();

  if (!imageUrl) {
    setUploading(false);
    return;
  }
}

    const { data: slugExists, error: slugError } = await supabase
  .from("products")
  .select("id")
  .eq("slug", slug)
  .maybeSingle();

if (slugError) {
  setUploading(false);
  alert(slugError.message);
  return;
}

if (slugExists) {
  alert("Slug already exists.");
  setUploading(false);
  return;
}

const { data: skuExists, error: skuError } = await supabase
  .from("products")
  .select("id")
  .eq("sku", sku)
  .maybeSingle();

if (skuError) {
  setUploading(false);
  alert(skuError.message);
  return;
}

if (sku && skuExists) {
  alert("SKU already exists.");
  setUploading(false);
  return;
}

const { data, error } = await supabase
  .from("products")
  .insert({
    category_id: categoryId,
    sub_category_id: subCategoryId || null,
    brand_id: brandId || null,
    color_id: colorIds[0] || null,
size_id: sizeIds[0] || null,

color_ids: colorIds,
size_ids: sizeIds,
    stock_status_id: stockStatusId || null,

    name,
    slug,
    sku,

    short_description: shortDescription,

description,

specification,

price: Number(price),

discount_percentage: Number(discountPercentage),

sale_price: salePrice
  ? Number(salePrice)
  : null,
    stock: Number(stock || 0),
    
show_hero: showHero,

hero_order: Number(heroOrder),

    featured,
new_arrival: newArrival,
active,


    image_url: imageUrl,
  })
  .select()
  .single();
    if (error) {
  setUploading(false);
  alert(error.message);
  return;
}

setUploadStatus(`Uploading ${galleryFiles.length} Gallery Image(s)...`);
await uploadGalleryImages(data.id);

setUploadStatus("Completed");
alert("Product Added Successfully");

    setCategoryId("");
    setSubCategoryId("");
    setBrandId("");
    setColorId("");
setSizeId("");

setColorIds([]);
setSizeIds([]);
    setStockStatusId("");
    setName("");
    setSlug("");
    setSku("");
    setShortDescription("");
setDescription("");
setSpecification("");
setPrice("");
setDiscountPercentage("0");
setSalePrice("");
    setStock("0");
    setFeatured(false);
setNewArrival(false);
setShowHero(false);

setHeroOrder("0");
setActive(true);
    setSlugEdited(false);

    if (imagePreview) {
  URL.revokeObjectURL(imagePreview);
}

galleryPreviews.forEach((url) => URL.revokeObjectURL(url));

setImageFile(null);
setImagePreview("");

setGalleryFiles([]);
setGalleryPreviews([]);

setUploading(false);

} catch (error: any) {

  setUploading(false);

  alert(error.message || "Something went wrong.");

}
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
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
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

        <select
  value={subCategoryId}
  onChange={(e) => setSubCategoryId(e.target.value)}
  className="border border-gray-600 bg-black text-white p-2 w-full rounded"
>
  <option value="">
    Select Sub Category
  </option>

  {subCategories.map((item) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.name}
    </option>
  ))}
</select>

<select
  value={brandId}
  onChange={(e) => setBrandId(e.target.value)}
  className="border border-gray-600 bg-black text-white p-2 w-full rounded"
>
  <option value="">
    Select Brand
  </option>

  {brands.map((item) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.name}
    </option>
  ))}
</select>

<div className="border border-gray-600 rounded p-3">

  <p className="font-medium mb-2">
    Available Colors
  </p>

  <div className="grid grid-cols-2 gap-2">

    {colors.map((item) => (

      <label
        key={item.id}
        className="flex items-center gap-2 cursor-pointer"
      >

        <input
          type="checkbox"
          checked={colorIds.includes(item.id)}
          onChange={() => toggleColor(item.id)}
        />

        {item.name}

      </label>

    ))}

  </div>

</div>

<div className="border border-gray-600 rounded p-3">

  <p className="font-medium mb-2">
    Available Sizes
  </p>

  <div className="grid grid-cols-2 gap-2">

    {sizes.map((item) => (

      <label
        key={item.id}
        className="flex items-center gap-2 cursor-pointer"
      >

        <input
          type="checkbox"
          checked={sizeIds.includes(item.id)}
          onChange={() => toggleSize(item.id)}
        />

        {item.name}

      </label>

    ))}

  </div>

</div>

<select
  value={stockStatusId}
  onChange={(e) => setStockStatusId(e.target.value)}
  className="border border-gray-600 bg-black text-white p-2 w-full rounded"
>
  <option value="">
    Select Stock Status
  </option>

  {stockStatuses.map((item) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.name}
    </option>
  ))}
</select>

        <input
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
          placeholder="Slug"
          value={slug}
          onChange={(e) => {
            setSlugEdited(true);
            setSlug(e.target.value);
          }}
        />

        <input
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        <textarea
          rows={2}
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
          placeholder="Short Description"
          value={shortDescription}
          onChange={(e) =>
            setShortDescription(e.target.value)
          }
        />

        <textarea
  rows={5}
  className="border border-gray-600 bg-black text-white p-2 w-full rounded"
  placeholder="Description"
  value={description}
  onChange={(e) =>
    setDescription(e.target.value)
  }
/>

<textarea
  rows={5}
  className="border border-gray-600 bg-black text-white p-2 w-full rounded"
  placeholder="Specification"
  value={specification}
  onChange={(e) =>
    setSpecification(e.target.value)
  }
/>

        <input
          type="number"
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
          placeholder="Regular Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <input
  type="number"
  min="0"
  max="100"
  className="border border-gray-600 bg-black text-white p-2 w-full rounded"
  placeholder="Discount (%)"
  value={discountPercentage}
  onChange={(e) =>
    setDiscountPercentage(e.target.value)
  }
/>

        <input
  type="number"
  readOnly
  className="border border-gray-600 bg-gray-800 text-green-400 p-2 w-full rounded"
  placeholder="Sale Price (Auto)"
  value={salePrice}
/>

        <input
          type="number"
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
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
    className="border border-gray-600 bg-black text-white p-2 w-full rounded mt-2"
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
    className="border border-gray-600 bg-black text-white p-2 w-full rounded mt-2"
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

  <div className="mt-4">

    <p className="mb-3 font-medium">

      Gallery Preview ({galleryPreviews.length})

    </p>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

      {galleryPreviews.map((preview, index) => (

        <div
          key={index}
          className="relative border rounded-lg overflow-hidden"
        >

          <img
            src={preview}
            alt=""
            className="w-full h-32 object-cover"
          />

          <button
            type="button"
            onClick={() => {

              const newFiles =
                [...galleryFiles];

              const newPreview =
                [...galleryPreviews];

              newFiles.splice(index, 1);

              URL.revokeObjectURL(newPreview[index]);

newPreview.splice(index, 1);

setGalleryFiles(newFiles);

setGalleryPreviews(newPreview);

            }}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white w-7 h-7 rounded-full"
          >

            ✕

          </button>

        </div>

      ))}

    </div>

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
    checked={newArrival}
    onChange={(e) =>
      setNewArrival(e.target.checked)
    }
  />

  New Arrival Product

</label>

<label className="flex items-center gap-2">

  <input
    type="checkbox"
    checked={showHero}
    onChange={(e) =>
      setShowHero(e.target.checked)
    }
  />

  Show On Hero

</label>

{showHero && (

  <input
    type="number"
    min="0"
    placeholder="Hero Order"
    value={heroOrder}
    onChange={(e) =>
      setHeroOrder(e.target.value)
    }
    className="border border-gray-600 bg-black text-white p-2 w-full rounded"
  />

)}

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

        <label className="flex items-center gap-2">

  <input
    type="checkbox"
    checked={showHero}
    onChange={(e) =>
      setShowHero(e.target.checked)
    }
  />

  Show On Hero

</label>



{showHero && (

  <input
    type="number"
    min="0"
    placeholder="Hero Order"
    value={heroOrder}
    onChange={(e) =>
      setHeroOrder(e.target.value)
    }
    className="border border-gray-600 bg-black text-white p-2 w-full rounded"
  />

)}

        <button
  disabled={uploading}
  onClick={addProduct}
  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-5 py-2 rounded-lg"
>
          {uploading ? uploadStatus : "Save Product"}
        </button>

      </div>

    </div>
  );
}
