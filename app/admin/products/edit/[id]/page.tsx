"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

type GalleryImage = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
};

export default function EditProductPage() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;
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
const [stockStatusId, setStockStatusId] = useState("");
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

const [gallery, setGallery] = useState<GalleryImage[]>([]);

const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);


const [uploading, setUploading] = useState(false);
const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {

  if (!id) return;

  loadCategories();
  loadSubCategories();
  loadBrands();
  loadColors();
  loadSizes();
  loadStockStatuses();

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

  setCategoryId(data.category_id ?? "");
  setSubCategoryId(data.sub_category_id ?? "");
  setBrandId(data.brand_id ?? "");
  setColorId(data.color_id ?? "");
  setSizeId(data.size_id ?? "");
  setStockStatusId(data.stock_status_id ?? "");

  setName(data.name ?? "");
  setSlug(data.slug ?? "");
  setSku(data.sku ?? "");

  setShortDescription(data.short_description ?? "");
  setDescription(data.description ?? "");

  setPrice(String(data.price ?? ""));
  setSalePrice(data.sale_price ? String(data.sale_price) : "");

  setStock(String(data.stock ?? 0));

  setFeatured(data.featured);
  setActive(data.active);

  setImagePreview(data.image_url ?? "");

  setSlugEdited(true);
}



  // ==========================
  // UPLOAD IMAGE
  // ==========================

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

  async function updateProduct() {
  try {
    if (
  !categoryId ||
  !subCategoryId ||
  !brandId ||
  !colorId ||
  !sizeId ||
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
  .neq("id", id)
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
  .neq("id", id)
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
.update({
    category_id: categoryId,
    sub_category_id: subCategoryId || null,
    brand_id: brandId || null,
    color_id: colorId || null,
    size_id: sizeId || null,
    stock_status_id: stockStatusId || null,

    name,
    slug,
    sku,

    short_description: shortDescription,
    description,

    price: Number(price),
    sale_price: salePrice ? Number(salePrice) : null,
    stock: Number(stock || 0),

    featured,
    active,

    image_url: imageUrl,
  })
  .eq("id", id);
    if (error) {
  setUploading(false);
  alert(error.message);
  return;
}

setUploadStatus(`Uploading ${galleryFiles.length} Gallery Image(s)...`);
await uploadGalleryImages(id);

setUploadStatus("Completed");
alert("Product Updated Successfully");

router.push("/admin/products");

    // No reset required for Edit page

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

<select
  value={colorId}
  onChange={(e) => setColorId(e.target.value)}
  className="border border-gray-600 bg-black text-white p-2 w-full rounded"
>
  <option value="">
    Select Color
  </option>

  {colors.map((item) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.name}
    </option>
  ))}
</select>

<select
  value={sizeId}
  onChange={(e) => setSizeId(e.target.value)}
  className="border border-gray-600 bg-black text-white p-2 w-full rounded"
>
  <option value="">
    Select Size
  </option>

  {sizes.map((item) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.name}
    </option>
  ))}
</select>

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
          className="border border-gray-600 bg-black text-white p-2 w-full rounded"
          placeholder="Sale Price"
          value={salePrice}
          onChange={(e) =>
            setSalePrice(e.target.value)
          }
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
            checked={active}
            onChange={(e) =>
              setActive(e.target.checked)
            }
          />

          Active Product

        </label>

        <button
  disabled={uploading}
  onClick={updateProduct}
  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-5 py-2 rounded-lg"
>
          {uploading ? uploadStatus : "Update Product"}
        </button>

      </div>

    </div>
  );
}
