export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Church } from "@prisma/client";

async function getChurch(id: string) {
  return prisma.church.findUnique({ where: { id } });
}

function InfoRow({ label, value, href }: { label: string; value: string | null; href?: string }) {
  if (!value) return null;
  return (
    <div className="py-3 flex items-start">
      <dt className="w-44 flex-shrink-0 text-xs font-semibold text-stone-400 uppercase tracking-wide pt-0.5">{label}</dt>
      <dd className="text-sm text-navy">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-sage hover:text-sage-dark underline">
            {value}
          </a>
        ) : value}
      </dd>
    </div>
  );
}

function SocialLink({ href, label, icon }: { href: string | null; label: string; icon: React.ReactNode }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-sm text-navy transition-colors">
      {icon}
      <span>{label}</span>
    </a>
  );
}

export default async function ChurchDetailPage({ params }: { params: { id: string } }) {
  const church = await getChurch(params.id);
  if (!church) notFound();

  const fullAddress = [church.address, church.city, church.state, church.zip].filter(Boolean).join(", ");
  const mapUrl = fullAddress ? `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}` : null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-stone-400">
        <Link href="/churches" className="hover:text-navy transition-colors">Churches</Link>
        <span>/</span>
        <span className="text-navy truncate">{church.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-navy">{church.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            {church.denomination && (
              <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-medium">
                {church.denomination}
              </span>
            )}
            {church.state && (
              <span className="text-xs text-stone-400">{[church.city, church.state].filter(Boolean).join(", ")}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/churches/${church.id}/edit`} className="btn-secondary flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          {/* Church Info */}
          <div className="card px-5 py-2">
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest pt-3 pb-1">Church Info</h2>
            <dl className="divide-y divide-stone-100">
              <InfoRow label="Address" value={fullAddress || null} href={mapUrl ?? undefined} />
              <InfoRow label="Phone" value={church.phone} href={church.phone ? `tel:${church.phone}` : undefined} />
              <InfoRow label="Website" value={church.website} href={church.website ?? undefined} />
              <InfoRow label="Denomination" value={church.denomination} />
            </dl>
          </div>

          {/* Lead Pastor */}
          {(church.pastorName || church.pastorEmail || church.pastorCell) && (
            <div className="card px-5 py-2">
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest pt-3 pb-1">Lead Pastor</h2>
              <dl className="divide-y divide-stone-100">
                <InfoRow label="Name" value={church.pastorName} />
                <InfoRow label="Email" value={church.pastorEmail} href={church.pastorEmail ? `mailto:${church.pastorEmail}` : undefined} />
                <InfoRow label="Cell" value={church.pastorCell} href={church.pastorCell ? `tel:${church.pastorCell}` : undefined} />
              </dl>
            </div>
          )}

          {/* Associate Pastor */}
          {(church.associatePastorName || church.associatePastorEmail || church.associatePastorCell) && (
            <div className="card px-5 py-2">
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest pt-3 pb-1">Associate Pastor</h2>
              <dl className="divide-y divide-stone-100">
                <InfoRow label="Name" value={church.associatePastorName} />
                <InfoRow label="Email" value={church.associatePastorEmail} href={church.associatePastorEmail ? `mailto:${church.associatePastorEmail}` : undefined} />
                <InfoRow label="Cell" value={church.associatePastorCell} href={church.associatePastorCell ? `tel:${church.associatePastorCell}` : undefined} />
              </dl>
            </div>
          )}

          {/* Notes */}
          {church.notes && (
            <div className="card px-5 py-4">
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Internal Notes</h2>
              <p className="text-sm text-navy whitespace-pre-wrap leading-relaxed">{church.notes}</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Social Media */}
          {(church.facebook || church.instagram || church.twitter || church.youtube) && (
            <div className="card p-4">
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Social Media</h2>
              <div className="space-y-2">
                <SocialLink href={church.facebook} label="Facebook" icon={
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                } />
                <SocialLink href={church.instagram} label="Instagram" icon={
                  <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                } />
                <SocialLink href={church.twitter} label="Twitter / X" icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                } />
                <SocialLink href={church.youtube} label="YouTube" icon={
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                } />
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="card p-4">
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {church.pastorEmail && (
                <a href={`mailto:${church.pastorEmail}`}
                  className="flex items-center gap-2 text-sm text-navy hover:text-sage transition-colors py-1">
                  <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Pastor
                </a>
              )}
              {church.phone && (
                <a href={`tel:${church.phone}`}
                  className="flex items-center gap-2 text-sm text-navy hover:text-sage transition-colors py-1">
                  <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Church
                </a>
              )}
              {mapUrl && (
                <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-navy hover:text-sage transition-colors py-1">
                  <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  View on Map
                </a>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="text-xs text-stone-400 space-y-1 px-1">
            <p>Added {new Date(church.createdAt).toLocaleDateString()}</p>
            <p>Updated {new Date(church.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
