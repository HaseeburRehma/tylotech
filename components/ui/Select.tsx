"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string; icon?: LucideIcon };

/**
 * Select-only combobox (WAI-ARIA pattern) shared by every form: focus stays on the
 * trigger, the listbox is rendered in a portal so dialogs and cards never clip it and
 * it follows page/dialog scrolling, options are announced via aria-activedescendant.
 * Keys: ↑ ↓ Home End Enter Space Esc Tab, type-ahead by first letter.
 *
 * The caller styles the trigger box (height, border, radius) through `className`, so
 * the field matches the inputs of its own form.
 */
export default function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid = false,
  describedBy,
  ariaLabel,
  icon: TriggerIcon,
  className,
  openClassName = "border-[#d1aa71] shadow-[0_0_0_4px_rgba(212,168,99,0.18)]",
  textClassName = "text-[14px] sm:text-[15px]",
  placeholderClassName = "text-[#a8a49d]",
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder: string;
  invalid?: boolean;
  describedBy?: string;
  /** only when no <label htmlFor={id}> names the field */
  ariaLabel?: string;
  icon?: LucideIcon;
  className?: string;
  openClassName?: string;
  textClassName?: string;
  placeholderClassName?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const listId = `${id}-list-${uid}`;
  const optId = (i: number) => `${id}-opt-${uid}-${i}`;
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<{ left: number; top: number; width: number; up: boolean; maxH: number } | null>(null);
  const selected = options.findIndex((o) => o.value === value);
  const current = selected >= 0 ? options[selected] : null;
  const CurIcon = current?.icon ?? TriggerIcon;
  const withIcons = options.some((o) => o.icon);

  const place = useCallback(() => {
    const r = trigger.current?.getBoundingClientRect();
    if (!r) return;
    const width = Math.max(r.width, 220);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    const full = Math.min(options.length * 42 + 12, 340);
    const below = window.innerHeight - r.bottom - 14;
    const above = r.top - 14;
    // open downwards whenever a comfortable list fits there; flip up only if below is tight
    const up = below < Math.min(full, 220) && above > below;
    const maxH = Math.max(140, Math.min(full, up ? above : below));
    setPos({ left, top: up ? r.top - maxH - 6 : r.bottom + 6, width, up, maxH });
  }, [options.length]);

  const openList = (at = selected >= 0 ? selected : 0) => {
    place();
    setActive(at);
    setOpen(true);
  };
  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };

  useLayoutEffect(() => {
    if (!open || !list.current) return;
    list.current.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!trigger.current?.contains(e.target as Node) && !list.current?.contains(e.target as Node)) setOpen(false);
    };
    // the trigger moved (page or dialog scrolled): follow it, or close once it left the screen
    const reflow = (e?: Event) => {
      if (e && list.current?.contains(e.target as Node)) return; // scrolling inside the list
      const r = trigger.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) setOpen(false);
      else place();
    };
    document.addEventListener("pointerdown", away);
    window.addEventListener("resize", reflow);
    window.addEventListener("scroll", reflow, { capture: true, passive: true });
    return () => {
      document.removeEventListener("pointerdown", away);
      window.removeEventListener("resize", reflow);
      window.removeEventListener("scroll", reflow, { capture: true });
    };
  }, [open, place]);

  const onKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.min(last, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(last);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(active);
        else openList();
        break;
      case "Escape":
        if (open) {
          e.preventDefault(); // keeps a surrounding modal open
          e.stopPropagation();
          setOpen(false);
        }
        break;
      case "Tab":
        if (open) setOpen(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const i = options.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
          if (i >= 0) {
            if (!open) openList(i);
            else setActive(i);
          }
        }
    }
  };

  return (
    <>
      <button
        ref={trigger}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optId(active) : undefined}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKey}
        className={cn("relative flex w-full cursor-pointer items-center gap-2.5 pr-10 text-left outline-none transition-[border-color,box-shadow]", className, open && openClassName)}
      >
        {CurIcon && <CurIcon className={cn("size-4 shrink-0", current ? "text-[#94713f]" : "text-[#a8a49d]")} strokeWidth={1.9} aria-hidden />}
        <span className={cn("min-w-0 flex-1 truncate", textClassName, !current && placeholderClassName)}>{current?.label ?? placeholder}</span>
        <ChevronDown
          className={cn("pointer-events-none absolute right-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#7d7973] transition-transform duration-200", open && "rotate-180")}
          strokeWidth={1.8}
          aria-hidden
        />
      </button>

      {open &&
        pos &&
        createPortal(
          <ul
            ref={list}
            id={listId}
            role="listbox"
            aria-labelledby={id}
            data-lenis-prevent
            style={{ left: pos.left, top: pos.top, width: pos.width, maxHeight: pos.maxH }}
            className={cn(
              "fixed z-[120] overflow-y-auto overscroll-contain rounded-[14px] border border-[#e2e0dc] bg-white p-1.5 shadow-[0_18px_40px_-12px_rgba(0,20,28,0.35),0_4px_12px_rgba(0,20,28,0.08)] animate-[tlDrop_.16s_cubic-bezier(.2,.8,.2,1)_both] motion-reduce:animate-none",
              pos.up ? "origin-bottom" : "origin-top",
            )}
          >
            {options.map((o, i) => {
              const Ico = o.icon;
              const isSel = i === selected;
              return (
                <li
                  key={o.value}
                  id={optId(i)}
                  role="option"
                  aria-selected={isSel}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex h-10 cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 text-[14px] transition-colors",
                    i === active && "bg-[#f4f1ea]",
                    isSel ? "font-semibold text-[#7a5b30]" : "text-[#1a1917]",
                  )}
                >
                  {withIcons && (
                    <span className={cn("grid size-7 shrink-0 place-items-center rounded-[8px]", isSel ? "bg-[#d1aa71] text-white" : "bg-[#f6f5f3] text-[#5b6b70]")}>
                      {Ico && <Ico className="size-[15px]" strokeWidth={2} />}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {isSel && <Check className="size-4 shrink-0 text-[#94713f]" strokeWidth={2.4} />}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </>
  );
}
