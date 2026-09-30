const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "throwawaymail.com",
  "mohmal.com",
  "tempail.com",
  "burnermail.io",
  "tempmailo.com",
  "emailondeck.com",
  "mintemail.com",
]);

const DOMAIN_TYPOS = {
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmail.co": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outllok.com": "outlook.com",
};

/**
 * Generates a unique LOV Member ID (e.g. LOV-100004 or LOV-849201)
 * ensuring no collision with existing members or pending users.
 */
export function generateUniqueLovId(existingIds = []) {
  const idSet = new Set(existingIds.map((id) => String(id).toUpperCase()));
  let candidate = "";
  do {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    candidate = `LOV-${randomNum}`;
  } while (idSet.has(candidate));
  return candidate;
}

/**
 * Validates that an email address:
 * 1. Has valid syntax
 * 2. Is not a known typo of a major email provider
 * 3. Is not a disposable/temporary/fake email service
 * 4. Has real, active DNS MX (Mail Exchange) servers on the internet
 */
export async function verifyRealEmailAddress(rawEmail) {
  const email = (rawEmail || "").trim().toLowerCase();

  if (!email) {
    return { valid: false, reason: "Please enter an email address." };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      reason: "Invalid email format. Example: name@gmail.com",
    };
  }

  const [localPart, domain] = email.split("@");

  if (localPart.length < 2) {
    return {
      valid: false,
      reason: "Email username part is too short.",
    };
  }

  if (DOMAIN_TYPOS[domain]) {
    return {
      valid: false,
      reason: `Did you mean ${localPart}@${DOMAIN_TYPOS[domain]}? "${domain}" appears to be a typo.`,
      suggestion: `${localPart}@${DOMAIN_TYPOS[domain]}`,
    };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason:
        "Temporary or disposable email addresses are not allowed. Please use your real personal email.",
    };
  }

  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`
    );

    if (response.ok) {
      const data = await response.json();
      // Status 0 = NOERROR, and Answer array must contain MX records (type 15)
      const hasMx =
        data.Status === 0 &&
        Array.isArray(data.Answer) &&
        data.Answer.some((rec) => rec.type === 15 && rec.data);

      if (!hasMx) {
        return {
          valid: false,
          reason: `The domain "@${domain}" does not have valid mail servers (MX records). Please enter a real, existing email address.`,
        };
      }

      return {
        valid: true,
        domain,
        mxVerified: true,
        mxHost: data.Answer.find((rec) => rec.type === 15)?.data || domain,
      };
    }
  } catch {
    // Fallback if offline: still enforce strict syntax + non-disposable check
  }

  return {
    valid: true,
    domain,
    mxVerified: false,
  };
}
