import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { ImageUploadControl } from '../ImageUploadControl';
import { ResilientImage } from '../ResilientImage';
import { updateThenAndNow, updateYoungerLetter } from '../../lib/autobiographyService';
import type { ThenAndNowData, YoungerLetterData } from '../../types/autobiography';

export function AdminSpecialsTab({
  thenAndNow,
  letter,
  onSaved,
}: {
  thenAndNow: ThenAndNowData;
  letter: YoungerLetterData;
  onSaved: () => Promise<void>;
}) {
  const [tnForm, setTnForm] = useState<ThenAndNowData>(thenAndNow);
  const [letterForm, setLetterForm] = useState<YoungerLetterData>(letter);
  const [savingTn, setSavingTn] = useState(false);
  const [savingLetter, setSavingLetter] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    setTnForm(thenAndNow);
  }, [thenAndNow]);

  useEffect(() => {
    setLetterForm(letter);
  }, [letter]);

  const handleSaveThenNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTn(true);
    setStatus(null);
    try {
      await updateThenAndNow(tnForm);
      await onSaved();
      setStatus({ type: 'ok', text: '"Then & Now" saved successfully.' });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to save Then & Now.',
      });
    } finally {
      setSavingTn(false);
    }
  };

  const handleSaveLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLetter(true);
    setStatus(null);
    try {
      await updateYoungerLetter(letterForm);
      await onSaved();
      setStatus({ type: 'ok', text: '"To the Younger Me" letter saved successfully.' });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to save letter.',
      });
    } finally {
      setSavingLetter(false);
    }
  };

  return (
    <div className="space-y-12">
      {status && (
        <div
          role="status"
          className={`flex items-center gap-2 p-3.5 rounded-lg text-sm ${
            status.type === 'ok'
              ? 'bg-[#F2F6F0] border border-[#C6D4BF] text-[#3D5235]'
              : 'bg-[#FDF2F0] border border-[#E6B8B0] text-[#8C2D1E]'
          }`}
        >
          {status.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{status.text}</span>
        </div>
      )}

      {/* 1. Then & Now */}
      <form onSubmit={handleSaveThenNow} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DACD]">
          <div>
            <h2 className="font-editorial text-3xl font-semibold text-[#241B15]">
              Then and Now: A Journey Through Time
            </h2>
            <p className="text-sm text-[#6E5C4E]">
              Upload your childhood and present photographs and edit your reflection.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingTn}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium hover:bg-[#3A2C23] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingTn ? 'Saving...' : 'Save Then & Now'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E3DACD] space-y-3">
            <h3 className="font-editorial text-xl font-semibold">Left: Younger Self</h3>
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#EFE8DC]">
              <ResilientImage src={tnForm.younger_photo_url} alt="Younger self" className="w-full h-full object-cover" />
            </div>
            <ImageUploadControl
              label="Upload Younger Photo"
              folder="then-and-now"
              onUploaded={({ publicUrl }) => setTnForm((f) => ({ ...f, younger_photo_url: publicUrl }))}
            />
            <input
              type="text"
              placeholder="Date or Age"
              value={tnForm.younger_date_age}
              onChange={(e) => setTnForm((f) => ({ ...f, younger_date_age: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
            />
            <textarea
              rows={2}
              placeholder="Caption"
              value={tnForm.younger_caption}
              onChange={(e) => setTnForm((f) => ({ ...f, younger_caption: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E3DACD] space-y-3">
            <h3 className="font-editorial text-xl font-semibold">Right: Present Self</h3>
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#EFE8DC]">
              <ResilientImage src={tnForm.present_photo_url} alt="Present self" className="w-full h-full object-cover" />
            </div>
            <ImageUploadControl
              label="Upload Current Photo"
              folder="then-and-now"
              onUploaded={({ publicUrl }) => setTnForm((f) => ({ ...f, present_photo_url: publicUrl }))}
            />
            <input
              type="text"
              placeholder="Date or Age"
              value={tnForm.present_date_age}
              onChange={(e) => setTnForm((f) => ({ ...f, present_date_age: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
            />
            <textarea
              rows={2}
              placeholder="Caption"
              value={tnForm.present_caption}
              onChange={(e) => setTnForm((f) => ({ ...f, present_caption: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
            />
          </div>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase text-[#6E5C4E]">Reflection Title</span>
          <input
            type="text"
            value={tnForm.reflection_title}
            onChange={(e) => setTnForm((f) => ({ ...f, reflection_title: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase text-[#6E5C4E]">Reflection Content</span>
          <textarea
            rows={5}
            value={tnForm.reflection_content}
            onChange={(e) => setTnForm((f) => ({ ...f, reflection_content: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm leading-relaxed"
          />
        </label>
      </form>

      {/* 2. To the Younger Me */}
      <form onSubmit={handleSaveLetter} className="space-y-6 pt-8 border-t border-[#E3DACD]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DACD]">
          <div>
            <h2 className="font-editorial text-3xl font-semibold text-[#241B15]">
              To the Younger Me (Personal Letter)
            </h2>
            <p className="text-sm text-[#6E5C4E]">
              Write, edit, and publish your personal letter to your younger self.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingLetter}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium hover:bg-[#3A2C23] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingLetter ? 'Saving...' : 'Save & Publish Letter'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 space-y-3">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E3DACD] bg-[#EFE8DC]">
              <ResilientImage
                src={letterForm.childhood_photo_url}
                alt="Letter childhood photo"
                className="w-full h-full object-cover"
              />
            </div>
            <ImageUploadControl
              label="Upload Childhood Photo"
              folder="letter"
              onUploaded={({ publicUrl }) =>
                setLetterForm((f) => ({ ...f, childhood_photo_url: publicUrl }))
              }
            />
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1">
                <span className="text-xs font-medium uppercase text-[#6E5C4E]">Letter Title</span>
                <input
                  type="text"
                  value={letterForm.title}
                  onChange={(e) => setLetterForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium uppercase text-[#6E5C4E]">Date</span>
                <input
                  type="text"
                  value={letterForm.letter_date}
                  onChange={(e) => setLetterForm((f) => ({ ...f, letter_date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
                />
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-xs font-medium uppercase text-[#6E5C4E]">Letter Body</span>
              <textarea
                rows={10}
                value={letterForm.letter_body}
                onChange={(e) => setLetterForm((f) => ({ ...f, letter_body: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm leading-relaxed"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-medium uppercase text-[#6E5C4E]">Signature</span>
              <textarea
                rows={2}
                value={letterForm.signature}
                onChange={(e) => setLetterForm((f) => ({ ...f, signature: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
