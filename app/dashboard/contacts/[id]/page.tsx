import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Phone, Calendar, MapPin, Star, Pencil } from "lucide-react";
import { getContact, getCachedBrief } from "@/lib/contacts/queries";
import { AvatarWithColor } from "@/components/shared/avatar-with-color";
import { getRelationshipLabel } from "@/components/shared/relationship-badge";
import { FrequencyCounter } from "@/components/contacts/frequency-counter";
import { InteractionTimeline } from "@/components/contacts/interaction-timeline";
import { ContactDetailFab } from "@/components/contacts/contact-detail-fab";
import { BriefIAButton, BriefCard } from "@/components/contacts/contact-brief-widget";
import { VoiceDictateButton } from "@/components/contacts/voice-dictate-button";
import type { RelationshipType } from "@/types/database";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ContactDetailPage({ params }: Props) {
  const { id } = await params;
  const [data, cachedBriefData] = await Promise.all([
    getContact(id),
    getCachedBrief(id),
  ]);

  if (!data) notFound();

  const { contact, interests, recentInteractions } = data;

  // Health percentage — derive from most recent interaction
  const lastInteractionDate =
    recentInteractions.length > 0
      ? new Date(recentInteractions[0].occurred_at)
      : null;

  const daysSince = lastInteractionDate
    ? Math.floor(
        (Date.now() - lastInteractionDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  const healthPercent = (() => {
    if (daysSince === null) return 0;
    const freq = contact.target_frequency_days > 0 ? contact.target_frequency_days : 30;
    if (daysSince <= freq) return 100;
    if (daysSince <= freq * 1.5) return 75;
    if (daysSince <= freq * 2) return 50;
    return 25;
  })();

  const lastContactLabel =
    daysSince === null
      ? "Sin contacto aún"
      : daysSince === 0
        ? "Hoy"
        : daysSince === 1
          ? "Hace 1 día"
          : `Hace ${daysSince} días`;

  const birthdayLabel = contact.birthday
    ? format(parseISO(contact.birthday), "d MMM", { locale: es })
    : null;

  return (
    <div className="bg-[#fff8f5] min-h-screen pb-32">
      {/* Hero */}
      <div className="relative w-full h-[320px] overflow-hidden">
        {contact.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={contact.photo_url}
            alt={contact.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-[#9c3e21] flex items-center justify-center">
            <AvatarWithColor
              name={contact.name}
              size="lg"
              className="!w-28 !h-28 !text-4xl"
            />
          </div>
        )}

        {/* Navigation controls */}
        <div className="absolute top-12 left-5 right-5 flex justify-between items-center z-10">
          <Link
            href="/dashboard/contacts"
            className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm text-[#9c3e21] hover:bg-[#ffdbd1] transition-colors active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <Link
            href={`/dashboard/contacts/${id}/edit`}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm text-[#9c3e21] hover:bg-[#ffdbd1] transition-colors active:scale-90"
          >
            <Pencil className="w-5 h-5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Content panel */}
      <div className="relative -mt-10 bg-[#fff8f5] rounded-t-3xl min-h-screen">
        {/* Junction chip */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#f5ece8]">
            <Calendar className="w-4 h-4 text-[#9c3e21]" strokeWidth={1.5} />
            <span className="text-sm font-medium text-[#1f1b18]">
              {lastContactLabel}
            </span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 pt-12 text-center">
          {/* Name & meta */}
          <h1 className="text-[28px] font-bold leading-tight text-[#1f1b18] mb-2">
            {contact.name}
          </h1>
          <div className="flex flex-wrap justify-center gap-x-3 text-sm font-medium text-[#56423c] mb-7">
            {(contact.company ?? contact.role) && (
              <>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" strokeWidth={1.5} />
                  <span>{[contact.role, contact.company].filter(Boolean).join(" · ")}</span>
                </div>
                <span className="opacity-30">•</span>
              </>
            )}
            {birthdayLabel && (
              <>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" strokeWidth={1.5} />
                  <span>{birthdayLabel}</span>
                </div>
                <span className="opacity-30">•</span>
              </>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" strokeWidth={1.5} />
              <span>
                {getRelationshipLabel(contact.relationship_type as RelationshipType)}
              </span>
            </div>
          </div>

          {/* Action row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {contact.phone ? (
              <a
                href={`tel:${contact.phone}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#fbf2ed] hover:bg-[#efe6e2] transition-colors group"
              >
                <Phone className="w-6 h-6 text-[#9c3e21] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-[#9c3e21]">Llamar</span>
              </a>
            ) : (
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#fbf2ed] opacity-40">
                <Phone className="w-6 h-6 text-[#9c3e21]" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-[#9c3e21]">Llamar</span>
              </div>
            )}
            {contact.email || contact.phone ? (
              <a
                href={
                  contact.phone
                    ? `https://wa.me/${contact.phone.replace(/\D/g, "")}`
                    : `mailto:${contact.email}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#fbf2ed] hover:bg-[#efe6e2] transition-colors group"
              >
                <MessageCircle className="w-6 h-6 text-[#9c3e21] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-[#9c3e21]">Mensaje</span>
              </a>
            ) : (
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#fbf2ed] opacity-40">
                <MessageCircle className="w-6 h-6 text-[#9c3e21]" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-[#9c3e21]">Mensaje</span>
              </div>
            )}
            <BriefIAButton
              contactId={contact.id}
              contactName={contact.name}
              contactPhotoUrl={contact.photo_url}
            />
            <VoiceDictateButton
              contactId={contact.id}
              contactName={contact.name}
            />
          </div>

          {/* Brief card preview — only when there's a valid cached brief */}
          {cachedBriefData?.brief && (
            <div className="mb-6 w-full">
              <BriefCard
                contactId={contact.id}
                contactName={contact.name}
                contactPhotoUrl={contact.photo_url}
                cachedBrief={cachedBriefData.brief}
                cachedAt={cachedBriefData.createdAt}
              />
            </div>
          )}

          {/* Interests / Tags */}
          {interests.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {interests.map((interest) => (
                <span
                  key={interest.id}
                  className="px-3 py-1 bg-[#9c3e21]/10 text-[#9c3e21] rounded-full text-sm font-medium"
                >
                  {interest.tag}
                </span>
              ))}
            </div>
          )}

          {/* Frequency + health */}
          <div className="mb-6 text-left">
            <FrequencyCounter
              contactId={contact.id}
              initialDays={contact.target_frequency_days}
              healthPercent={healthPercent}
            />
          </div>

          {/* Recent history */}
          <div className="text-left">
            <h3 className="text-xl font-semibold text-[#1f1b18] mb-4">
              Historial reciente
            </h3>
            <InteractionTimeline interactions={recentInteractions} />
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="mt-6 text-left">
              <h3 className="text-xl font-semibold text-[#1f1b18] mb-3">Notas</h3>
              <div className="bg-[#fbf2ed] rounded-xl p-5">
                <p className="text-sm text-[#56423c] leading-relaxed whitespace-pre-wrap">
                  {contact.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAB — registrar interacción */}
      <ContactDetailFab
        contactId={contact.id}
        contactName={contact.name}
        contactPhotoUrl={contact.photo_url}
      />
    </div>
  );
}
