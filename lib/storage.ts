import { supabase } from "./supabase";

export async function uploadImage(
  file: File,
  folder: string
) {
  try {
    const extension =
      file.name.split(".").pop() || "jpg";

    const fileName =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath =
      `${folder}/${fileName}`;

    const { error } =
      await supabase.storage
        .from("products")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (error) {
      return {
        success: false,
        error,
        url: "",
        path: "",
      };
    }

    const { data } =
      supabase.storage
        .from("products")
        .getPublicUrl(filePath);

    return {
      success: true,
      error: null,
      url: data.publicUrl,
      path: filePath,
    };
  } catch (error) {
    return {
      success: false,
      error,
      url: "",
      path: "",
    };
  }
}

export async function deleteImage(
  path: string
) {
  return await supabase.storage
    .from("products")
    .remove([path]);
}

export function getImagePath(
  url: string
) {
  if (!url) return "";

  const marker =
    "/storage/v1/object/public/products/";

  const index =
    url.indexOf(marker);

  if (index === -1) return "";

  return url.substring(
    index + marker.length
  );
}