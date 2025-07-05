"use client";


import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Nav from '@/components/navbar/nav';
import Footer from '@/components/Footer/footer';
import questionData from '@/app/data/data.json';




 function JournalModal({ journal, onClose, parseJournalContentGrouped, onUpdate, onDelete }) {
  const [sectionIdx, setSectionIdx] = React.useState(0);
  const [editMode, setEditMode] = React.useState(false);
  const [editAnswers, setEditAnswers] = React.useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const sections = parseJournalContentGrouped(journal.content);
  const section = sections[sectionIdx];
  const dateObj = new Date(journal.createdAt);
  const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
  const dateStr = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  // Prepare editable answers state
  React.useEffect(() => {
    if (editMode) {
      // Flatten all answers for all sections
      const allAnswers = [];
      sections.forEach(sec => sec.qas.forEach(qa => allAnswers.push(qa.answer)));
      setEditAnswers(allAnswers);
    } else {
      setEditAnswers(null);
    }
    // eslint-disable-next-line
  }, [editMode, journal._id]);

  // Helper to get answer index in flat array
  const getAnswerIdx = (sectionIdx, qaIdx) => {
    let idx = 0;
    for (let i = 0; i < sectionIdx; i++) {
      idx += sections[i].qas.length;
    }
    return idx + qaIdx;
  };

  // Save handler (real API call)
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/journals/${journal._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: editAnswers }),
      });
      if (!res.ok) throw new Error('Failed to update journal');
      const updatedJournal = await res.json();
      setSaving(false);
      setEditMode(false);
      if (onUpdate) onUpdate(updatedJournal);
      onClose();
    } catch (err) {
      setSaving(false);
      alert('Failed to save changes: ' + err.message);
    }
  };

  // Delete handler (real API call)
  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      const res = await fetch(`/api/journals/${journal._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete journal');
      if (onDelete) onDelete(journal._id);
      onClose();
    } catch (err) {
      alert('Failed to delete journal: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-900 rounded-2xl p-0 max-w-lg w-full shadow-2xl relative">
        {/* Modal header with icons and close */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-neutral-800">
          <div className="flex gap-2 items-center">
            <button
              className={`transition-colors text-xl rounded-full p-1 ${editMode ? 'text-white' : 'text-violet-400 hover:text-violet-200'}`}
              title="Edit"
              onClick={() => setEditMode(true)}
              disabled={editMode}
              style={{ boxShadow: editMode ? '0 0 0 2px #a78bfa' : undefined }}
            >
              <Pencil size={22} color={editMode ? '#fff' : undefined} fill="none" />
            </button>
            <button
              className="text-red-400 hover:text-red-200 text-xl rounded-full p-1 transition-colors"
              title="Delete"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={22} />
            </button>
          </div>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-violet-400">
              {dayName}, {dateStr}
            </div>
          </div>
          <button
            className="text-white text-2xl hover:text-violet-400 ml-2"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="mt-4 px-6 mb-4">
          <div className="mb-4 flex justify-between items-center">
            <button
              className="px-3 py-1 rounded bg-violet-700 text-white font-semibold disabled:opacity-40"
              onClick={() => setSectionIdx(i => Math.max(0, i - 1))}
              disabled={sectionIdx === 0}
            >Prev</button>
            <div className="text-lg font-bold text-violet-300">{section.title}</div>
            <button
              className="px-3 py-1 rounded bg-violet-700 text-white font-semibold disabled:opacity-40"
              onClick={() => setSectionIdx(i => Math.min(sections.length - 1, i + 1))}
              disabled={sectionIdx === sections.length - 1}
            >Next</button>
          </div>
          <div className="space-y-4">
            {section.qas.map((qa, idx) => {
              const answerIdx = getAnswerIdx(sectionIdx, idx);
              return (
                <div key={idx} className="mb-2">
                  <div className="font-semibold text-white/80 mb-1">{qa.question}</div>
                  {editMode ? (
                    <input
                      className="w-full rounded p-2 bg-neutral-800 text-white border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                      value={editAnswers ? editAnswers[answerIdx] : ''}
                      onChange={e => {
                        const newAnswers = [...editAnswers];
                        newAnswers[answerIdx] = e.target.value;
                        setEditAnswers(newAnswers);
                      }}
                    />
                  ) : (
                    <div className="text-white/90 bg-neutral-800 rounded p-3 min-h-[2.5rem]">{qa.answer}</div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Save button always visible in edit mode */}
          {editMode && (
            <button
              className="mt-6 w-full py-3 rounded bg-violet-600 text-white font-bold text-lg hover:bg-violet-700 transition disabled:opacity-60 mb-8"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
        {/* Delete confirmation popup */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
            <div className="bg-neutral-800 rounded-xl p-8 shadow-xl max-w-xs w-full text-center mb-8">
              <div className="text-lg text-white mb-4">Are you sure you want to delete this journal?</div>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white font-bold hover:bg-red-600"
                  onClick={handleDelete}
                >Yes, Delete</button>
                <button
                  className="px-4 py-2 rounded bg-neutral-600 text-white font-bold hover:bg-neutral-700"
                  onClick={() => setShowDeleteConfirm(false)}
                >Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default function JournalsPage() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetch("/api/journals", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        // Support both array and object response
        let journalsArr = Array.isArray(data) ? data : data.journals;
        if (!Array.isArray(journalsArr)) journalsArr = [];
        setJournals(journalsArr);
        setLoading(false);
        // Auto-open journal if date param is present
        const dateParam = searchParams.get("date");
        if (dateParam && Array.isArray(journalsArr)) {
          const found = journalsArr.find(j => {
            const d = new Date(j.createdAt);
            return d.toISOString().slice(0, 10) === dateParam;
          });
          if (found) setSelected(found);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router, searchParams]);

  // Helper: parse journal content into grouped Q&A by section
  function parseJournalContentGrouped(content) {
    const sections = questionData.questions || [];
    let answers = [];
    if (Array.isArray(content)) {
      answers = content;
    } else {
      try {
        answers = JSON.parse(content);
      } catch {
        // fallback: try splitting as before
        answers = typeof content === 'string' ? content.split('|||') : [];
        if (answers.length === 1 && typeof content === 'string') answers = content.split('\n');
        if (answers.length === 1 && typeof content === 'string') answers = content.split('  ');
      }
    }
    let idx = 0;
    return sections.map(section => {
      const qas = (section.questionlabels || []).map((label) => {
        const answer = answers[idx] ? answers[idx].toString().trim() : '';
        idx++;
        return { question: label, answer };
      });
      return { title: section.title, qas };
    });
  }


  // Remove filter feature

  // If a date param is present, auto-open the journal for that date
  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam && journals.length > 0) {
      const found = journals.find(j => {
        const d = new Date(j.createdAt);
        return d.toISOString().slice(0, 10) === dateParam;
      });
      if (found) setSelected(found);
    }
  }, [searchParams, journals]);

  if (loading) return (
    <>
      <Nav />
      <div className="text-center mt-20">Loading journals...</div>
      <Footer /> 
    </>
  );

  return (
    <>
      <Nav />
      <div className="mt-16 mx-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Your Journals</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow transition"
              onClick={() => router.push('/main')}
            >
              Make a Journal
            </button>
          </div>
        </div>
        {journals.length === 0 ? (
          <p className="text-neutral-400">No journals found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {journals.map((j) => {
              const dateObj = new Date(j.createdAt);
              const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
              const dateStr = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
              return (
                <div
                  key={j._id}
                  className="bg-neutral-800 p-8 rounded-2xl shadow-lg cursor-pointer hover:scale-105 hover:bg-violet-700/20 transition-all border border-violet-700"
                  onClick={() => setSelected(j)}
                >
                  <div className="text-xl font-bold text-violet-400 mb-2">
                    {dayName}, {dateStr}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Popup modal for selected journal */}
        {selected && typeof window !== 'undefined' && (
          <JournalModal
            journal={selected}
            onClose={() => setSelected(null)}
            parseJournalContentGrouped={parseJournalContentGrouped}
            onUpdate={updatedJournal => {
              setJournals(journals => journals.map(j => j._id === updatedJournal._id ? updatedJournal : j));
              setSelected(updatedJournal);
            }}
            onDelete={deletedId => {
              setJournals(journals => journals.filter(j => j._id !== deletedId));
              setSelected(null);
            }}
          />
        )}
      </div>
    </>
  );
}



// (removed duplicate or stub JournalModal declaration)
