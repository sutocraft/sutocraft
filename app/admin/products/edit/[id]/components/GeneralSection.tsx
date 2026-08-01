"use client";

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];

  categoryId: string;
  setCategoryId: (v: string) => void;

  name: string;
  setName: (v: string) => void;

  slug: string;
  setSlug: (v: string) => void;

  slugEdited: boolean;
  setSlugEdited: (v: boolean) => void;

  sku: string;
  setSku: (v: string) => void;

  shortDescription: string;
  setShortDescription: (v: string) => void;

  description: string;
setDescription: (v: string) => void;

specification: string;
setSpecification: (v: string) => void;

  price: string;
  setPrice: (v: string) => void;

  salePrice: string;
  setSalePrice: (v: string) => void;

  stock: string;
  setStock: (v: string) => void;

  featured: boolean;
  setFeatured: (v: boolean) => void;

  active: boolean;
  setActive: (v: boolean) => void;
};

export default function GeneralSection(props: Props) {

  return (

    <div className="space-y-5">
        
              {/* Category */}

      <div>

        <label className="block mb-2 font-medium">
          Category
        </label>

        <select
          value={props.categoryId}
          onChange={(e) =>
            props.setCategoryId(e.target.value)
          }
          className="w-full rounded border p-2"
        >

          <option value="">
            Select Category
          </option>

          {props.categories.map((cat) => (

            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>

          ))}

        </select>

      </div>

      {/* Product Name */}

      <div>

        <label className="block mb-2 font-medium">
          Product Name
        </label>

        <input
          type="text"
          value={props.name}
          onChange={(e) =>
            props.setName(e.target.value)
          }
          className="w-full rounded border p-2"
        />

      </div>

      {/* Slug */}

      <div>

        <label className="block mb-2 font-medium">
          Slug
        </label>

        <input
          type="text"
          value={props.slug}
          onChange={(e) => {

            props.setSlugEdited(true);

            props.setSlug(e.target.value);

          }}
          className="w-full rounded border p-2"
        />

      </div>

      {/* SKU */}

      <div>

        <label className="block mb-2 font-medium">
          SKU
        </label>

        <input
          type="text"
          value={props.sku}
          onChange={(e) =>
            props.setSku(e.target.value)
          }
          className="w-full rounded border p-2"
        />

      </div>

            {/* Specification */}

<div>

  <label className="block mb-2 font-medium">
    Specification
  </label>

  <textarea
    rows={8}
    value={props.specification}
    onChange={(e) =>
      props.setSpecification(
        e.target.value
      )
    }
    className="w-full rounded border p-2"
  />

</div>

{/* Price */} 

      {/* Price */}

      <div>

        <label className="block mb-2 font-medium">
          Price
        </label>

        <input
          type="number"
          value={props.price}
          onChange={(e) =>
            props.setPrice(e.target.value)
          }
          className="w-full rounded border p-2"
        />

      </div>

      {/* Sale Price */}

      <div>

        <label className="block mb-2 font-medium">
          Sale Price
        </label>

        <input
          type="number"
          value={props.salePrice}
          onChange={(e) =>
            props.setSalePrice(
              e.target.value
            )
          }
          className="w-full rounded border p-2"
        />

      </div>

            {/* Stock */}

      <div>

        <label className="block mb-2 font-medium">
          Stock
        </label>

        <input
          type="number"
          value={props.stock}
          onChange={(e) =>
            props.setStock(e.target.value)
          }
          className="w-full rounded border p-2"
        />

      </div>

      {/* Featured */}

      <div className="flex items-center gap-2">

        <input
          id="featured"
          type="checkbox"
          checked={props.featured}
          onChange={(e) =>
            props.setFeatured(e.target.checked)
          }
        />

        <label htmlFor="featured">
          Featured Product
        </label>

      </div>

      {/* Active */}

      <div className="flex items-center gap-2">

        <input
          id="active"
          type="checkbox"
          checked={props.active}
          onChange={(e) =>
            props.setActive(e.target.checked)
          }
        />

        <label htmlFor="active">
          Active Product
        </label>

      </div>

    </div>

  );

}