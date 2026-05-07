"use client";

import { useState, useTransition } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type Initial = {
  email: string;
  full_name: string;
  phone: string;
  affiliation: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

export function ProfileForm({ initial, userId }: { initial: Initial; userId: string }) {
  const [form, setForm] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Initial>(key: K, value: Initial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setError(null);
    startTransition(async () => {
      try {
        const supabase = getSupabaseBrowser();
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: form.full_name || null,
            phone: form.phone || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
        if (error) throw error;
        setStatus("saved");
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section title="Contact information">
        <Field label="Email" value={form.email} disabled />
        <Field
          label="Full name"
          value={form.full_name}
          onChange={(v) => set("full_name", v)}
          placeholder="Dr. Jane Smith"
        />
        <Field
          label="Phone"
          value={form.phone}
          onChange={(v) => set("phone", v)}
          placeholder="+1 (954) 555-0199"
        />
        <Field
          label="Affiliation"
          value={form.affiliation}
          onChange={(v) => set("affiliation", v)}
          placeholder="Research institution / lab name"
          note="Optional — helps us route compliance questions correctly."
        />
      </Section>

      <Section title="Shipping address">
        <Field
          label="Street"
          value={form.street}
          onChange={(v) => set("street", v)}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field
            label="City"
            value={form.city}
            onChange={(v) => set("city", v)}
          />
          <Field
            label="State"
            value={form.state}
            onChange={(v) => set("state", v)}
          />
          <Field
            label="ZIP"
            value={form.zip}
            onChange={(v) => set("zip", v)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Address is also collected at checkout — saving here pre-fills it.
        </p>
      </Section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
            pending
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-brand text-brand-foreground hover:opacity-90"
          }`}
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" && (
          <span className="text-sm text-emerald-700">Saved.</span>
        )}
        {status === "error" && error && (
          <span className="text-sm text-rose-700">{error}</span>
        )}
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  note,
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  note?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        }`}
      />
      {note && <p className="mt-1 text-[11px] text-muted-foreground">{note}</p>}
    </div>
  );
}
