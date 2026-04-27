"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ImageIcon,
  Info,
  Plus,
  SlidersHorizontal,
  UploadCloud,
  X,
  Trash2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminCard,
  adminContent,
  mobileFilter,
} from "@/components/admin/admin-ui";

const allergensList = ["Dairy", "Nuts", "Gluten", "Seafood", "Soy"];

interface Category {
  id: string;
  name: string;
}

const Label = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <label
    className={`block text-[0.65rem] font-bold uppercase tracking-widest text-[#888888] ${className}`}
  >
    {children}
  </label>
);

const Input = ({ className = "", prefix, suffix, ...props }: any) => (
  <div className={`relative mt-2 ${className}`}>
    {prefix && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold">
        {prefix}
      </div>
    )}
    <input
      className={`w-full rounded-lg border border-[#333333] bg-[#141414] py-3 text-sm text-white outline-0 placeholder:text-[#555555] focus:border-fly-orange transition-colors ${prefix ? "pl-8" : "px-4"} ${suffix ? "pr-12" : "pr-4"}`}
      {...props}
    />
    {suffix && (
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555555] text-sm font-semibold pointer-events-none">
        {suffix}
      </div>
    )}
  </div>
);

const Toggle = ({
  checked,
  onChange,
}: {
  checked?: boolean;
  onChange?: (val: boolean) => void;
}) => (
  <div
    onClick={() => onChange?.(!checked)}
    className={`relative h-6 w-11 rounded-full cursor-pointer transition-colors ${checked ? "bg-fly-orange" : "bg-[#333]"}`}
  >
    <span
      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
    />
  </div>
);

import { api } from "@/lib/api";

export default function EditMenuItemPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const itemId = params.id;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [isLive, setIsLive] = useState(true);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // New Category state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch item and categories in parallel
        const [item, cats] = await Promise.all([
          api.get(`/menu/items/${itemId}`),
          api.get("/menu/categories"),
        ]);

        setCategories(cats);

        // Populate form
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price.toString());
        setCategoryId(item.categoryId);
        setStatus(item.status);
        setIsLive(item.isLive);
        setSelectedAllergens(item.allergens || []);

        if (item.media && item.media.length > 0) {
          let url = item.media[0].url;
          if (!url.startsWith("http")) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:4000";
            url = `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
          }
          setExistingImageUrl(url);
          setPreview(url);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCategoryLoading(true);
    try {
      const newCat = await api.post("/menu/categories", { name: newCategoryName });
      const cats = await api.get("/menu/categories");
      setCategories(cats);
      setCategoryId(newCat.id);
      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (err) {
      console.error("Failed to create category");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setExistingImageUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.patch(`/menu/items/${itemId}`, {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        status,
        isLive,
        allergens: selectedAllergens,
      });

      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("ownerType", "MENU_ITEM");
        formData.append("ownerId", itemId);
        formData.append("menuItemId", itemId);

        await api.upload("/media/upload", formData);
      }

      router.push("/admin/menu-management");
    } catch (err: any) {
      alert(`Error updating item: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this item? This action cannot be undone.",
      )
    )
      return;

    try {
      await api.delete(`/menu/items/${itemId}`);
      router.push("/admin/menu-management");
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  if (loading) {
    return (
      <AdminShell active="Menu Management">
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-fly-orange border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="Menu Management">
      <form onSubmit={handleSubmit} className={`${adminContent} pb-32`}>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#262626] pb-6">
          <div>
            <p className="m-0 text-[0.65rem] font-bold uppercase tracking-widest text-[#888888]">
              Inventory <span className="mx-2 text-[#555]">&gt;</span> Menu
              Management <span className="mx-2 text-[#555]">&gt;</span>{" "}
              <strong className="text-fly-orange">Edit Item</strong>
            </p>
            <h1 className="m-0 mt-2 text-3xl font-black text-white tracking-tight">
              Catalogue Modification
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-6 py-3.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete Item
            </button>
            <button
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-fly-orange px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-orange-600 shadow-[0_8px_24px_rgba(249,115,22,0.2)] disabled:opacity-50"
              type="submit"
            >
              <UploadCloud className="h-4 w-4" />
              {saving ? "Saving Changes..." : "Update Menu Item"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
          <div className="flex flex-col gap-6">
            <article className={`${adminCard} p-8`}>
              <div className="mb-8 flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-fly-orange/10 text-fly-orange">
                  <Info className="h-5 w-5" />
                </div>
                <h2 className="m-0 text-lg font-bold text-white">
                  Identity & Pricing
                </h2>
              </div>

              <Label>
                Item Name
                <Input
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  placeholder="e.g. Signature Truffle Ribeye"
                  required
                />
              </Label>

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <Label>Category</Label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(!isAddingCategory)}
                      className="text-[0.6rem] font-black uppercase tracking-widest text-fly-orange hover:underline"
                    >
                      {isAddingCategory ? "Cancel" : "+ Add New"}
                    </button>
                  </div>

                  {isAddingCategory ? (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New category name..."
                        className="flex-1 rounded-lg border border-fly-orange/30 bg-[#141414] px-4 py-2.5 text-sm text-white outline-0 focus:border-fly-orange transition-colors"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={categoryLoading || !newCategoryName.trim()}
                        className="rounded-lg bg-fly-orange px-4 py-2 text-xs font-bold text-white"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="relative mt-2">
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-[#333333] bg-[#141414] px-4 py-3 text-sm text-white outline-0 focus:border-fly-orange transition-colors"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555] pointer-events-none" />
                    </div>
                  )}
                </div>
                <Label>
                  Base Price
                  <Input
                    value={price}
                    onChange={(e: any) => setPrice(e.target.value)}
                    prefix="$"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    required
                  />
                </Label>
              </div>

              <Label className="mt-6">
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 w-full min-h-[120px] rounded-lg border border-[#333333] bg-[#141414] p-4 text-sm text-white outline-0 placeholder:text-[#555555] focus:border-fly-orange transition-colors"
                  placeholder="Describe the flavors..."
                />
              </Label>
            </article>

            <article className={`${adminCard} p-8`}>
              <div className="mb-8 flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-fly-orange/10 text-fly-orange">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <h2 className="m-0 text-lg font-bold text-white">
                  Media & Gallery
                </h2>
              </div>

              <div className="group relative grid h-64 w-full place-items-center rounded-2xl border-2 border-dashed border-[#333333] bg-[#141414] transition-colors hover:border-fly-orange/50">
                {preview ? (
                  <div className="relative h-full w-full p-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setImage(null);
                        setExistingImageUrl(null);
                      }}
                      className="absolute right-6 top-6 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#1a1a1a] text-fly-orange">
                      <Plus className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-white">
                      Change Product Shot
                    </p>
                    <input
                      type="file"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                )}
              </div>
            </article>
          </div>

          <div className="flex flex-col gap-6">
            <article className={`${adminCard} p-6`}>
              <h3 className="m-0 mb-6 text-sm font-bold text-white uppercase tracking-wider">
                Availability
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="m-0 text-sm font-bold text-white">
                    Visible on Menu
                  </p>
                  <p className="m-0 mt-1 text-[0.7rem] text-[#666]">
                    Show to customers
                  </p>
                </div>
                <Toggle checked={isLive} onChange={setIsLive} />
              </div>

              <div className="mt-8">
                <Label>Current Status</Label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("AVAILABLE")}
                    className={`rounded-lg py-2.5 text-[0.65rem] font-black uppercase tracking-wider transition-colors ${status === "AVAILABLE" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-[#1a1a1a] text-[#555] border border-[#262626]"}`}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("UNAVAILABLE")}
                    className={`rounded-lg py-2.5 text-[0.65rem] font-black uppercase tracking-wider transition-colors ${status === "UNAVAILABLE" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-[#1a1a1a] text-[#555] border border-[#262626]"}`}
                  >
                    Out of Stock
                  </button>
                </div>
              </div>
            </article>

            <article className={`${adminCard} p-6`}>
              <h3 className="m-0 mb-6 text-sm font-bold text-white uppercase tracking-wider">
                Allergens
              </h3>
              <div className="flex flex-wrap gap-2">
                {allergensList.map((allergen) => (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => {
                      if (selectedAllergens.includes(allergen)) {
                        setSelectedAllergens(
                          selectedAllergens.filter((a) => a !== allergen),
                        );
                      } else {
                        setSelectedAllergens([...selectedAllergens, allergen]);
                      }
                    }}
                    className={`rounded-lg px-4 py-2 text-[0.65rem] font-bold uppercase tracking-widest transition-colors ${selectedAllergens.includes(allergen) ? "bg-fly-orange text-white" : "bg-[#1a1a1a] text-[#666] border border-[#262626]"}`}
                  >
                    {allergen}
                  </button>
                ))}
              </div>
            </article>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
