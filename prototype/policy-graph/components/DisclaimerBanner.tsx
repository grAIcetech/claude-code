"use client";

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-[12px] text-amber-900 px-6 py-2 flex items-start gap-2">
      <span aria-hidden className="mt-[3px] inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
      <p>
        <strong className="font-semibold">Prototype.</strong> All policies,
        requirements, milestones, dates, citations, owners, and obligations are
        non-authoritative placeholders. The graph is intentionally incomplete
        and must not be relied on for legal or compliance interpretation.
      </p>
    </div>
  );
}
