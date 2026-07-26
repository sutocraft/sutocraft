"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import GeneralSection from "./components/GeneralSection";
import GallerySection from "./components/GallerySection";
import VariantManager from "./components/VariantManager";

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

        <GeneralSection
  categories={categories}
  categoryId={categoryId}
  setCategoryId={setCategoryId}

  name={name}
  setName={setName}

  slug={slug}
  setSlug={setSlug}

  slugEdited={slugEdited}
  setSlugEdited={setSlugEdited}

  sku={sku}
  setSku={setSku}

  shortDescription={shortDescription}
  setShortDescription={setShortDescription}

  description={description}
  setDescription={setDescription}

  price={price}
  setPrice={setPrice}

  salePrice={salePrice}
  setSalePrice={setSalePrice}

  stock={stock}
  setStock={setStock}

  featured={featured}
  setFeatured={setFeatured}

  active={active}
  setActive={setActive}
/>
<GallerySection
  imagePreview={imagePreview}
  imageFile={imageFile}
  setImageFile={setImageFile}
  setImagePreview={setImagePreview}

  gallery={gallery}

  moveGalleryUp={moveGalleryUp}
  moveGalleryDown={moveGalleryDown}
  deleteGalleryImage={deleteGalleryImage}

  galleryFiles={galleryFiles}
  setGalleryFiles={setGalleryFiles}

  galleryPreviews={galleryPreviews}
  setGalleryPreviews={setGalleryPreviews}
/>
<VariantManager
  productId={id}
/>


      </div>
    </div>
  );
}