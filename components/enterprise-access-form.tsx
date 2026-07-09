"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react"

/* ---------- Placeholder integration functions ---------- */

function submitToHubSpotAPI(payload: Record<string, string>) {
  console.log("[v0] submitToHubSpotAPI called with:", payload)
}

function redirectToDropboxSignAPI() {
  console.log("[v0] redirectToDropboxSignAPI called")
}

/* ---------- Field option data ---------- */

const SELECT_FIELDS: { name: string; label: string; options: string[] }[] = [
  {
    name: "companyType",
    label: "Company Type",
    options: ["Startup", "Enterprise", "Research Lab", "Government", "Cloud Provider"],
  },
  {
    name: "gpuCapacity",
    label: "Desired GPU Capacity",
    options: ["8–64 GPUs", "64–256 GPUs", "256–1,024 GPUs", "1,024+ GPUs"],
  },
  {
    name: "timeline",
    label: "Target Deployment Timeline",
    options: ["Immediate", "1–3 months", "3–6 months", "6–12 months"],
  },
  {
    name: "workload",
    label: "Workload Type",
    options: ["LLM Training", "Fine-tuning", "Inference", "HPC / Simulation", "Mixed"],
  },
  {
    name: "region",
    label: "Preferred Region",
    options: ["North America", "Europe", "Asia Pacific", "Middle East", "No Preference"],
  },
  {
    name: "nda",
    label: "NDA Needed?",
    options: ["Yes", "No", "Undecided"],
  },
]

const TEXT_FIELDS: { name: string; label: string; type: string; required?: boolean }[] = [
  { name: "fullName", label: "Full Name *", type: "text", required: true },
  { name: "workEmail", label: "Work email*", type: "email", required: true },
  { name: "companyName", label: "Company name*", type: "text", required: true },
  { name: "role", label: "Role / Title", type: "text" },
]

const COMPLIANCE_STATEMENTS = [
  "Customer is not listed on any U.S. government restricted party list, including but not limited to the Entity List, Denied Persons List, or Specially Designated Nationals (SDN) List.",
  "Customer is not owned or controlled by any entity or individual appearing on such restricted lists.",
  "Customer is not organized in, and does not operate primarily from, any jurisdiction subject to comprehensive U.S. sanctions.",
  "Customer agrees to use CNEX services in compliance with applicable U.S. export control and trade compliance laws, including the EAR.",
  "Customer will not knowingly provide access to CNEX GPU services to restricted or sanctioned entities.",
]

/* ---------- Reusable input primitives ---------- */

function TextField({
  label,
  type,
  value,
  onChange,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-white/30 bg-transparent py-3 text-base text-white placeholder:text-white/50 outline-none transition-colors focus:border-[#4ade4a]"
      />
    </div>
  )
}

function SelectField({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none border-b border-white/30 bg-transparent py-3 pr-6 text-base outline-none transition-colors focus:border-[#4ade4a] ${
          value ? "text-white" : "text-white/50"
        }`}
      >
        <option value="" disabled className="bg-[#2b3a2a] text-white/60">
          {label}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#2b3a2a] text-white">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
      />
    </div>
  )
}

/* ---------- Left column ---------- */

function LeftPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <h1 className="text-pretty text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
        {title}
      </h1>
      <div className="mt-8 max-w-md text-base leading-relaxed text-white/60">{children}</div>
      <p className="mt-8 text-xs leading-relaxed text-white/40">
        By submitting, you agree to our{" "}
        <a href="/terms" className="text-white/70 underline underline-offset-2 transition-colors hover:text-[#4ade4a]">
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="text-white/70 underline underline-offset-2 transition-colors hover:text-[#4ade4a]"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}

/* ---------- Main component ---------- */

export function EnterpriseAccessForm() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<Record<string, string>>({})
  const [checks, setChecks] = useState<boolean[]>(Array(COMPLIANCE_STATEMENTS.length).fill(false))

  const allChecked = useMemo(() => checks.every(Boolean), [checks])

  const setField = (name: string, value: string) => setForm((prev) => ({ ...prev, [name]: value }))

  const toggleCheck = (i: number) =>
    setChecks((prev) => prev.map((c, idx) => (idx === i ? !c : c)))

  const handleNext = () => {
    submitToHubSpotAPI(form)
    setStep(2)
  }

  const handleClose = () => {
    console.log("[v0] Navigating to /enterprise-access")
    router.push("/enterprise-access")
  }

  const transition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div className="min-h-screen bg-[#2b3a2a] font-sans text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <a
          href="https://cambridgenexus.com/"
          className="flex items-center transition-opacity hover:opacity-80"
          aria-label="Cambridge Nexus home"
        >
          <img src="/cambridge-nexus-logo.svg" alt="Cambridge Nexus" className="h-6 w-auto" />
        </a>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-md border border-white/20 px-5 py-2 text-sm font-medium tracking-wide text-white/80 transition-colors hover:bg-white/10"
        >
          CLOSE X
        </button>
      </header>

      {/* Body */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:py-20">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="left-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={transition}
            >
              <LeftPanel title="Request Private Enterprise Access">
                Tell us about your organization and AI infrastructure needs. Qualified buyers and strategic partners may
                receive access to CNEX&apos;s private evaluation materials.
              </LeftPanel>
            </motion.div>
          ) : (
            <motion.div
              key="left-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={transition}
            >
              <LeftPanel title="Export Control & Compliance">
                To proceed with your request, please self-certify your compliance with U.S. export regulations.
              </LeftPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right column */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={transition}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  {TEXT_FIELDS.map((f) => (
                    <TextField
                      key={f.name}
                      label={f.label}
                      type={f.type}
                      value={form[f.name] ?? ""}
                      onChange={(v) => setField(f.name, v)}
                    />
                  ))}
                  {SELECT_FIELDS.map((f) => (
                    <SelectField
                      key={f.name}
                      label={f.label}
                      options={f.options}
                      value={form[f.name] ?? ""}
                      onChange={(v) => setField(f.name, v)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="group flex w-full items-center justify-between border-b-2 border-[#4ade4a] pb-4 text-left"
                >
                  <span className="text-2xl font-medium text-white sm:text-3xl">Next Step</span>
                  <ArrowUpRight className="h-7 w-7 text-[#4ade4a] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={transition}
                className="space-y-8"
              >
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="group -mt-2 flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back
                </button>

                <ul className="space-y-6">
                  {COMPLIANCE_STATEMENTS.map((statement, i) => (
                    <li key={i}>
                      <label className="flex cursor-pointer items-start gap-4">
                        <input
                          type="checkbox"
                          checked={checks[i]}
                          onChange={() => toggleCheck(i)}
                          className="peer sr-only"
                        />
                        <span
                          className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-white/30 transition-colors peer-checked:border-[#4ade4a] peer-checked:bg-[#4ade4a]"
                          aria-hidden
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className={`h-4 w-4 text-[#2b3a2a] transition-opacity ${
                              checks[i] ? "opacity-100" : "opacity-0"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                        <span className="text-base leading-relaxed text-white/75">{statement}</span>
                      </label>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={!allChecked}
                  onClick={() => allChecked && redirectToDropboxSignAPI()}
                  className={`group flex w-full items-center justify-between border-b-2 pb-4 text-left transition-all ${
                    allChecked
                      ? "border-[#4ade4a] cursor-pointer"
                      : "border-white/20 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`text-2xl font-semibold uppercase tracking-wide sm:text-3xl ${
                      allChecked ? "text-white" : "text-white/50"
                    }`}
                  >
                    Review &amp; Sign Documents
                  </span>
                  <ArrowUpRight
                    className={`h-7 w-7 transition-transform ${
                      allChecked
                        ? "text-[#4ade4a] group-hover:translate-x-1 group-hover:-translate-y-1"
                        : "text-white/40"
                    }`}
                  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
