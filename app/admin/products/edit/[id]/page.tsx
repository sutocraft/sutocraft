"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
 
  const [sizes, setSizes] = useState<Size[]>([]);
  const [stockStatuses, setStockStatuses] = useState<StockStatus[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  
const [sizeId, setSizeId] = useState("");


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
const [discountPercentage, setDiscountPercentage] = useState("");
const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");

  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [showHero, setShowHero] = useState(false);

const [heroOrder, setHeroOrder] = useState("0");
  const [active, setActive] = useState(true);

  const [slugEdited, setSlugEdited] = useState(false);

  // Main Image

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  // Existing Gallery

  const [gallery, setGallery] =
    useState<GalleryImage[]>([]);

  // New Gallery Upload

  const [galleryFiles, setGalleryFiles] =
    useState<File[]>([]);

  const [galleryPreviews, setGalleryPreviews] =
    useState<string[]>([]);

  const [uploading, setUploading] =
    useState(false);

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


  const [uploadStatus, setUploadStatus] =
    useState("");

  useEffect(() => {
    if (!id) return;

    loadCategories();
    loadSubCategories();
    loadBrands();
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
    alert(error.message);
    return;
  }

  setCategories(data || []);
}

async function loadSubCategories() {
  const { data, error } = await supabase
    .from("sub_categories")
    .select("id,name")
    .order("name");

  if (error) {
    alert(error.message);
    return;
  }

  setSubCategories(data || []);
}

async function loadBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("id,name")
    .order("name");

  if (error) {
    alert(error.message);
    return;
  }

  setBrands(data || []);
}

async function loadSizes() {
  const { data, error } = await supabase
    .from("sizes")
    .select("id,name")
    .order("name");

  if (error) {
    alert(error.message);
    return;
  }

  setSizes(data || []);
}

async function loadStockStatuses() {
  const { data, error } = await supabase
    .from("stock_statuses")
    .select("id,name")
    .order("name");

  if (error) {
    alert(error.message);
    return;
  }

  setStockStatuses(data || []);
}

function toggleSize(id: string) {
  setSizeIds((prev) =>
    prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
  );
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
setSizeId(data.size_id ?? "");

setSizeIds(data.size_ids ?? []);
  setStockStatusId(data.stock_status_id ?? "");

  setName(data.name ?? "");
  setSlug(data.slug ?? "");
  setSku(data.sku ?? "");

  setShortDescription(data.short_description ?? "");
setDescription(data.description ?? "");
setSpecification(data.specification ?? "");

setPrice(String(data.price ?? ""));

setDiscountPercentage(
  String(data.discount_percentage ?? 0)
);

setSalePrice(
  data.sale_price ? String(data.sale_price) : ""
);

  setStock(String(data.stock ?? 0));

  setFeatured(data.featured ?? false);

setNewArrival(data.new_arrival ?? false);

setShowHero(data.show_hero ?? false);

setHeroOrder(
  String(data.hero_order ?? 0)
);

setActive(data.active ?? true);

  setImagePreview(data.image_url ?? "");

  setSlugEdited(true);
}

async function loadGallery() {
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("sort_order");

  if (error) {
    alert(error.message);
    return;
  }

  setGallery(data || []);
}

// ==========================
// Upload Main Image
// ==========================

async function uploadImage() {
  if (!imageFile) return "";

  setUploadStatus("Uploading Main Image...");

  const ext = imageFile.name.split(".").pop();

  const fileName =
    `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } =
    await supabase.storage
      .from("products")
      .upload(fileName, imageFile);

  if (error) throw error;

  const { data } =
    supabase.storage
      .from("products")
      .getPublicUrl(fileName);

  return data.publicUrl;
}

// ==========================
// Upload Single Gallery Image
// ==========================

async function uploadSingleImage(file: File) {

  const ext = file.name.split(".").pop();

  const fileName =
    `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } =
    await supabase.storage
      .from("products")
      .upload(fileName, file);

  if (error) throw error;

  const { data } =
    supabase.storage
      .from("products")
      .getPublicUrl(fileName);

  return data.publicUrl;
}

// ==========================
// Upload Gallery
// ==========================

async function uploadGalleryImages(productId: string) {

  if (galleryFiles.length === 0) return;

  const insertData: {
  product_id: string;
  image_url: string;
  sort_order: number;
}[] = [];

  for (let i = 0; i < galleryFiles.length; i++) {

    const url =
      await uploadSingleImage(galleryFiles[i]);

    insertData.push({

      product_id: productId,

      image_url: url,

      sort_order: gallery.length + i,

    });

  }

  const { error } =
    await supabase
      .from("product_images")
      .insert(insertData);

  if (error) throw error;
}

// ==========================
// Delete Gallery Image
// ==========================

async function deleteGalleryImage(imageId: string) {

  const ok =
    confirm("Delete this image?");

  if (!ok) return;

  const { error } =
    await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

  if (error) {

    alert(error.message);

    return;

  }

  setGallery(
    gallery.filter(
      (item) => item.id !== imageId
    )
  );
}

// ==========================
// Move Gallery Up
// ==========================

async function moveGalleryUp(index: number) {

  if (index === 0) return;

  const items = [...gallery];

  [items[index - 1], items[index]] =
    [items[index], items[index - 1]];

  for (let i = 0; i < items.length; i++) {

    await supabase
      .from("product_images")
      .update({
        sort_order: i,
      })
      .eq("id", items[i].id);

    items[i].sort_order = i;
  }

  setGallery(items);
}

// ==========================
// Move Gallery Down
// ==========================

async function moveGalleryDown(index: number) {

  if (index === gallery.length - 1)
    return;

  const items = [...gallery];

  [items[index], items[index + 1]] =
    [items[index + 1], items[index]];

  for (let i = 0; i < items.length; i++) {

    await supabase
      .from("product_images")
      .update({
        sort_order: i,
      })
      .eq("id", items[i].id);

    items[i].sort_order = i;
  }

  setGallery(items);
}
// ==========================
// UPDATE PRODUCT
// ==========================

async function updateProduct() {

  try {

    if (
  !categoryId ||
  !subCategoryId ||
  !brandId ||

  sizeIds.length === 0 ||
  !stockStatusId ||
  !name.trim() ||
  !slug.trim() ||
  !price
) {

      alert("Please fill all required fields.");

      return;

    }

    setUploading(true);

    setUploadStatus("Saving Product...");

    let imageUrl = imagePreview;

    // Upload Main Image

    if (imageFile) {

      imageUrl = await uploadImage();

      if (!imageUrl) {

        setUploading(false);

        return;

      }

    }

    // Check Duplicate Slug

    const {
      data: slugExists,
      error: slugError,
    } = await supabase
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

      setUploading(false);

      alert("Slug already exists.");

      return;

    }

    // Check Duplicate SKU

    if (sku.trim() !== "") {

      const {
        data: skuExists,
        error: skuError,
      } = await supabase
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

      if (skuExists) {

        setUploading(false);

        alert("SKU already exists.");

        return;

      }

    }

    // Update Product

    const { error } = await supabase
      .from("products")
      .update({

        category_id: categoryId,

        sub_category_id:
          subCategoryId || null,

        brand_id:
  brandId || null,

size_id:
  sizeIds[0] || null,

size_ids:
  sizeIds,

        stock_status_id:
          stockStatusId || null,

        name,

        slug,

        sku,

        short_description:
  shortDescription,

description,

specification,

price: Number(price),

discount_percentage: Number(discountPercentage),

sale_price: salePrice
  ? Number(salePrice)
  : null,

        stock:
          Number(stock || 0),

        featured,

new_arrival: newArrival,

show_hero: showHero,

hero_order: Number(heroOrder),

active,

image_url: imageUrl,

      })
      .eq("id", id);

    if (error) {

      setUploading(false);

      alert(error.message);

      return;

    }

    // Upload New Gallery Images

    if (galleryFiles.length > 0) {

      setUploadStatus(
        `Uploading ${galleryFiles.length} Gallery Image(s)...`
      );

      await uploadGalleryImages(id);

    }

    setUploading(false);

    alert("Product Updated Successfully");

    router.push("/admin/products");

  }

  catch (err: any) {

    setUploading(false);

    alert(
      err.message ||
      "Something went wrong."
    );

  }

}


return (
  <div className="p-8">

    <h1 className="text-2xl font-bold mb-6">
      Edit Product
    </h1>

    <div className="space-y-4 max-w-xl">

      {/* Category */}

      <select
        value={categoryId}
        onChange={(e) =>
          setCategoryId(e.target.value)
        }
        className="border border-gray-600 bg-black text-white p-2 w-full rounded"
      >
        <option value="">
          Select Category
        </option>

        {categories.map((item) => (

          <option
            key={item.id}
            value={item.id}
          >
            {item.name}
          </option>

        ))}

      </select>

      {/* Sub Category */}

      <select
        value={subCategoryId}
        onChange={(e) =>
          setSubCategoryId(e.target.value)
        }
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

      {/* Brand */}

      <select
        value={brandId}
        onChange={(e) =>
          setBrandId(e.target.value)
        }
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

      {/* Color selection removed */}

      {/* Size */}

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

      {/* Stock Status */}

      <select
        value={stockStatusId}
        onChange={(e) =>
          setStockStatusId(e.target.value)
        }
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
        onChange={(e) =>
          setName(e.target.value)
        }
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
        onChange={(e) =>
          setSku(e.target.value)
        }
      />

      <textarea
        rows={2}
        className="border border-gray-600 bg-black text-white p-2 w-full rounded"
        placeholder="Short Description"
        value={shortDescription}
        onChange={(e) =>
          setShortDescription(
            e.target.value
          )
        }
      />

      <textarea
  rows={5}
  className="border border-gray-600 bg-black text-white p-2 w-full rounded"
  placeholder="Description"
  value={description}
  onChange={(e) =>
    setDescription(
      e.target.value
    )
  }
/>

<textarea
  rows={5}
  className="border border-gray-600 bg-black text-white p-2 w-full rounded"
  placeholder="Specification"
  value={specification}
  onChange={(e) =>
    setSpecification(
      e.target.value
    )
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
        className="border border-gray-600 bg-black text-white p-2 w-full rounded"
        placeholder="Sale Price"
        value={salePrice}
        onChange={(e) =>
          setSalePrice(
            e.target.value
          )
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

      {/* Main Image */}

      <div>

        <label className="font-medium">
          Main Product Image
        </label>

        <input
          type="file"
          accept="image/*"
          className="border border-gray-600 bg-black text-white p-2 w-full rounded mt-2"
          onChange={(e) => {

            const file =
              e.target.files?.[0];

            if (!file) return;

            setImageFile(file);

            setImagePreview(
              URL.createObjectURL(file)
            );

          }}
        />

      </div>

      {imagePreview && (

        <img
          src={imagePreview}
          alt=""
          className="w-48 h-48 object-cover rounded border"
        />

      )}

      {/* Gallery Upload */}

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

            const files =
              Array.from(
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

      {/* Existing Gallery */}

      {gallery.length > 0 && (

        <div className="mt-4">

          <p className="font-semibold mb-3">
            Existing Gallery ({gallery.length})
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {gallery.map((img, index) => (

              <div
                key={img.id}
                className="border rounded-lg overflow-hidden"
              >

                <img
                  src={img.image_url}
                  alt=""
                  className="w-full h-32 object-cover"
                />

                <div className="flex gap-2 p-2">

                  <button
                    type="button"
                    onClick={() =>
                      moveGalleryUp(index)
                    }
                    className="flex-1 bg-gray-700 text-white rounded py-1"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      moveGalleryDown(index)
                    }
                    className="flex-1 bg-gray-700 text-white rounded py-1"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteGalleryImage(
                        img.id
                      )
                    }
                    className="flex-1 bg-red-600 text-white rounded py-1"
                  >
                    ✕
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* New Gallery Preview */}

      {galleryPreviews.length > 0 && (

        <div className="mt-4">

          <p className="font-semibold mb-3">
            New Gallery ({galleryPreviews.length})
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

                    const files =
                      [...galleryFiles];

                    const previews =
                      [...galleryPreviews];

                    files.splice(index, 1);

                    URL.revokeObjectURL(
                      previews[index]
                    );

                    previews.splice(index, 1);

                    setGalleryFiles(files);

                    setGalleryPreviews(previews);

                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full"
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
            setFeatured(
              e.target.checked
            )
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
          checked={active}
          onChange={(e) =>
            setActive(
              e.target.checked
            )
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
        type="button"
        disabled={uploading}
        onClick={updateProduct}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-5 py-2 rounded-lg"
      >

        {uploading
          ? uploadStatus
          : "Update Product"}

      </button>

    </div>

  </div>

);
}

