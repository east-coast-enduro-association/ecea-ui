import { useState } from "react";

/**
 * ContactForm — Astro island (React).
 *
 * A self-contained, stateful form: good island candidate because it owns its
 * own interactive state, carries no SEO-critical content, and duplicates no
 * `.astro` markup. Replaces the previous inline <script> that only `alert()`ed
 * on submit — now with real client-side validation and an accessible,
 * inline status message.
 *
 * NOTE: there is still no backend wired up; a valid submit shows a success
 * message and resets. Swap `handleSubmit`'s body for a real POST when ready.
 */

const SUBJECTS = [
  "General Inquiry",
  "Event Question",
  "Registration Help",
  "Club Information",
  "Sponsorship",
  "Other",
];

const inputClasses =
  "w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500";

const submitButtonClasses =
  "inline-flex items-center justify-center gap-2 font-sans text-base font-medium border-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] transform hover:scale-105 active:scale-95 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 !text-white border-blue-600 hover:from-blue-700 hover:to-blue-800 hover:border-blue-700 hover:!text-white active:from-blue-800 active:to-blue-900 focus:ring-blue-500 shadow-lg hover:shadow-xl no-underline hover:no-underline";

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", subject: "", message: "" };

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = "Please enter your name.";
  if (!fields.email.trim()) errors.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = "Please enter a valid email address.";
  if (!fields.subject) errors.subject = "Please choose a subject.";
  if (!fields.message.trim()) errors.message = "Please enter a message.";
  return errors;
}

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof Fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // TODO: POST to a real endpoint when available.
    setSubmitted(true);
    setFields(EMPTY);
  };

  const fieldError = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`${key}-error`} className="mt-1 text-sm text-red-600">
        {errors[key]}
      </p>
    ) : null;

  const borderClass = (key: keyof Fields) =>
    errors[key] ? "border-red-400" : "border-gray-300";

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      {submitted && (
        <div
          role="status"
          className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800"
        >
          Thanks for your message! We'll get back to you soon.
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={fields.name}
          onChange={update("name")}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`${inputClasses} ${borderClass("name")}`}
        />
        {fieldError("name")}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={fields.email}
          onChange={update("email")}
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`${inputClasses} ${borderClass("email")}`}
        />
        {fieldError("email")}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <select
          id="subject"
          name="subject"
          value={fields.subject}
          onChange={update("subject")}
          aria-invalid={errors.subject ? "true" : undefined}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={`${inputClasses} ${borderClass("subject")}`}
        >
          <option value="">Please select</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {fieldError("subject")}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={fields.message}
          onChange={update("message")}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${inputClasses} ${borderClass("message")}`}
        />
        {fieldError("message")}
      </div>

      <div>
        <button type="submit" className={submitButtonClasses}>Send Message</button>
      </div>
    </form>
  );
}
