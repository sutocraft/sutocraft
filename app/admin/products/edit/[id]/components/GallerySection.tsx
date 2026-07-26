type GalleryImage = {
  id: string;
  image_url: string;
  sort_order: number;
};

type Props = {
  imagePreview: string;

  imageFile: File | null;
  setImageFile: (file: File | null) => void;

  setImagePreview: (url: string) => void;

  gallery: GalleryImage[];

  moveGalleryUp: (img: GalleryImage) => void;
  moveGalleryDown: (img: GalleryImage) => void;

  deleteGalleryImage: (id: string) => void;

  galleryFiles: File[];
  setGalleryFiles: (files: File[]) => void;

  galleryPreviews: string[];
  setGalleryPreviews: (urls: string[]) => void;
};

export default function GallerySection(props: Props) {

  return (

    <div className="space-y-5">

      {/* Main Image */}

      {props.imagePreview && (

        <div>

          <label className="font-semibold block mb-2">
            Current Main Image
          </label>

          <img
            src={props.imagePreview}
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

            props.setImageFile(file);

            props.setImagePreview(
              URL.createObjectURL(file)
            );

          }}
        />

      </div>

      {/* Gallery */}

      <div>

        <label className="font-semibold block mb-3">

          Product Gallery

        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {props.gallery.map((img) => (

            <div
              key={img.id}
              className="border rounded overflow-hidden"
            >

              <img
                src={img.image_url}
                className="w-full h-28 object-cover"
              />

              <div className="flex">

                <button
                  className="flex-1 bg-gray-700 text-white"
                  onClick={() => props.moveGalleryUp(img)}
                >
                  ↑
                </button>

                <button
                  className="flex-1 bg-gray-700 text-white"
                  onClick={() => props.moveGalleryDown(img)}
                >
                  ↓
                </button>

                <button
                  className="flex-1 bg-red-600 text-white"
                  onClick={() =>
                    props.deleteGalleryImage(img.id)
                  }
                >
                  ✕
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Add Gallery */}

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

            const files =
              Array.from(e.target.files || []);

            props.setGalleryFiles(files);

            props.setGalleryPreviews(

              files.map(file =>
                URL.createObjectURL(file)
              )

            );

          }}
        />

      </div>

      {props.galleryPreviews.length > 0 && (

        <div className="grid grid-cols-4 gap-3">

          {props.galleryPreviews.map((img, i) => (

            <img
              key={i}
              src={img}
              className="w-full h-28 rounded border object-cover"
            />

          ))}

        </div>

      )}

    </div>

  );

}