'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  Users,
  Tag,
  Trash2,
  Edit2,
  CheckSquare,
  Square,
  Copy,
  Check,
  X,
  ListPlus,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MeetingNote, BulletPointItem } from '@/types/task';
import { getStoredMeetingNotes, saveStoredMeetingNotes } from '@/services/storageService';

export const MeetingNotesView = () => {
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<MeetingNote | null>(null);

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('11:00');
  const [attendees, setAttendees] = useState('');
  const [category, setCategory] = useState('Project');
  const [summaryParagraph, setSummaryParagraph] = useState('');
  
  // Bullet Points state inside form
  const [bulletItems, setBulletItems] = useState<BulletPointItem[]>([]);
  const [newBulletText, setNewBulletText] = useState('');

  // UI state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  useEffect(() => {
    setMeetingNotes(getStoredMeetingNotes());
  }, []);

  const persistNotes = (updated: MeetingNote[]) => {
    setMeetingNotes(updated);
    saveStoredMeetingNotes(updated);
  };

  const handleOpenAddModal = () => {
    setEditingNote(null);
    setTitle('');
    setDate(todayStr);
    setTime('11:00');
    setAttendees('');
    setCategory('Project');
    setSummaryParagraph('');
    setBulletItems([
      { id: 'b-1', text: 'Discuss project roadmap & milestone timelines', completed: false },
      { id: 'b-2', text: 'Assign action items to team members', completed: false }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: MeetingNote) => {
    setEditingNote(note);
    setTitle(note.title);
    setDate(note.date);
    setTime(note.time || '11:00');
    setAttendees(note.attendees || '');
    setCategory(note.category || 'Project');
    setSummaryParagraph(note.summaryParagraph || '');
    setBulletItems(note.bulletPoints ? [...note.bulletPoints] : []);
    setIsModalOpen(true);
  };

  const handleAddBulletItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newBulletText.trim()) return;

    setBulletItems([
      ...bulletItems,
      { id: `b-${Date.now()}`, text: newBulletText.trim(), completed: false }
    ]);
    setNewBulletText('');
  };

  const handleRemoveBulletItem = (id: string) => {
    setBulletItems(bulletItems.filter((b) => b.id !== id));
  };

  const handleToggleBulletInModal = (id: string) => {
    setBulletItems(
      bulletItems.map((b) => (b.id === id ? { ...b, completed: !b.completed } : b))
    );
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingNote) {
      const updatedNotes = meetingNotes.map((n) =>
        n.id === editingNote.id
          ? {
              ...n,
              title: title.trim(),
              date,
              time,
              attendees: attendees.trim(),
              category,
              summaryParagraph: summaryParagraph.trim(),
              bulletPoints: bulletItems,
              updatedAt: new Date().toISOString()
            }
          : n
      );
      persistNotes(updatedNotes);
    } else {
      const newNote: MeetingNote = {
        id: `note-${Date.now()}`,
        title: title.trim(),
        date: date || todayStr,
        time: time || '11:00',
        attendees: attendees.trim(),
        category,
        summaryParagraph: summaryParagraph.trim(),
        bulletPoints: bulletItems,
        createdAt: new Date().toISOString()
      };
      persistNotes([newNote, ...meetingNotes]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this meeting note?')) {
      const updated = meetingNotes.filter((n) => n.id !== id);
      persistNotes(updated);
    }
  };

  const handleToggleBulletCard = (noteId: string, bulletId: string) => {
    const updated = meetingNotes.map((n) => {
      if (n.id === noteId) {
        const updatedBullets = n.bulletPoints.map((b) =>
          b.id === bulletId ? { ...b, completed: !b.completed } : b
        );
        return { ...n, bulletPoints: updatedBullets };
      }
      return n;
    });
    persistNotes(updated);
  };

  const handleCopyNoteText = (note: MeetingNote) => {
    const bulletsText = note.bulletPoints.map((b) => `• ${b.text}`).join('\n');
    const fullText = `📌 MEETING NOTE: ${note.title}\nDate: ${note.date} at ${note.time}\nAttendees: ${note.attendees || 'N/A'}\n\nSUMMARY / PARAGRAPH:\n${note.summaryParagraph || 'N/A'}\n\nACTION POINTS:\n${bulletsText}`;
    
    navigator.clipboard.writeText(fullText);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtering
  const filteredNotes = meetingNotes.filter((note) => {
    if (selectedCategory !== 'All' && note.category !== selectedCategory) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchSummary = note.summaryParagraph?.toLowerCase().includes(q);
      const matchAttendees = note.attendees?.toLowerCase().includes(q);
      const matchBullets = note.bulletPoints?.some((b) => b.text.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchAttendees && !matchBullets) return false;
    }
    return true;
  });

  const categoriesList = ['All', 'Project', 'Client', '1-on-1', 'Internal'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      {/* Simple Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-black dark:text-white tracking-tight">Meeting Notes</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Record meeting summaries in paragraphs and bullet action points.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Meeting Note</span>
        </button>
      </div>

      {/* Simple Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search meeting notes or bullet points..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Meeting Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 space-y-3">
            <FileText className="w-12 h-12 mx-auto opacity-30 text-zinc-500" />
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
              No meeting notes found
            </h3>
            <p className="text-xs max-w-sm mx-auto text-zinc-500 dark:text-zinc-400">
              Create your first meeting note to save summary paragraphs and bullet points checklist.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-xs rounded-xl cursor-pointer"
            >
              Create Note
            </button>
          </div>
        ) : (
          filteredNotes.map((note) => {
            return (
              <div
                key={note.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs transition-all space-y-4"
              >
                {/* Note Title & Header Metadata Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[11px] font-bold border border-zinc-200 dark:border-zinc-700">
                        {note.category || 'Meeting Note'}
                      </span>
                      <h2 className="text-base font-bold text-black dark:text-white leading-tight">
                        {note.title}
                      </h2>
                    </div>
                  </div>

                  {/* Actions & Controls */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => handleCopyNoteText(note)}
                      title="Copy meeting notes text"
                      className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === note.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-black dark:text-white" />
                          <span className="text-black dark:text-white font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(note)}
                      title="Edit Note"
                      className="p-2 text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      title="Delete Note"
                      className="p-2 text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub Metadata Pill Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                    <span>{note.date}</span>
                  </div>

                  {note.time && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full font-semibold">
                      <Clock className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                      <span>{note.time}</span>
                    </div>
                  )}

                  {note.attendees && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full font-semibold">
                      <Users className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                      <span>Attendees: {note.attendees}</span>
                    </div>
                  )}
                </div>

                {/* Paragraph Notes Summary Section */}
                {note.summaryParagraph && (
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-black dark:text-white block">
                      Overview Notes:
                    </span>
                    <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal whitespace-pre-line">
                      {note.summaryParagraph}
                    </p>
                  </div>
                )}

                {/* Bullet Points Action Items Checklist */}
                {note.bulletPoints && note.bulletPoints.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-black dark:text-white">
                        Action Points ({note.bulletPoints.filter(b => b.completed).length}/{note.bulletPoints.length}):
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {note.bulletPoints.map((bullet) => (
                        <div
                          key={bullet.id}
                          onClick={() => handleToggleBulletCard(note.id, bullet.id)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            bullet.completed
                              ? 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 hover:border-black dark:hover:border-white'
                          }`}
                        >
                          <button
                            type="button"
                            className="shrink-0 cursor-pointer"
                          >
                            {bullet.completed ? (
                              <CheckSquare className="w-4 h-4 text-black dark:text-white" />
                            ) : (
                              <Square className="w-4 h-4 text-zinc-400 hover:text-black dark:hover:text-white" />
                            )}
                          </button>
                          <span
                            className={`text-xs font-semibold leading-normal ${
                              bullet.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
                            }`}
                          >
                            • {bullet.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Creating/Editing Meeting Note */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-black dark:text-white">
                  {editingNote ? 'Edit Meeting Note' : 'Add New Meeting Note'}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Write paragraph notes and create bullet action points.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-black dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveNote} className="p-6 space-y-4 overflow-y-auto text-xs">
              {/* Meeting Title */}
              <div>
                <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Meeting Title / Subject *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Client Sync Meeting, Sprint Review..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                  required
                  autoFocus
                />
              </div>

              {/* Date, Time & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    Meeting Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold text-black dark:text-white"
                  >
                    <option value="Project">Project</option>
                    <option value="Client">Client</option>
                    <option value="1-on-1">1-on-1</option>
                    <option value="Internal">Internal</option>
                  </select>
                </div>
              </div>

              {/* Attendees */}
              <div>
                <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                  Attendees / Participants (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. John, Sarah, Alex..."
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-medium text-black dark:text-white"
                />
              </div>

              {/* 1. Paragraph Notes Section */}
              <div className="pt-2">
                <label className="block font-bold text-black dark:text-white mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Paragraph Summary / Meeting Notes</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Type full meeting paragraphs, discussion details, or general notes here..."
                  value={summaryParagraph}
                  onChange={(e) => setSummaryParagraph(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-normal text-black dark:text-white placeholder:text-zinc-400 leading-relaxed focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              {/* 2. Bullet Points Section */}
              <div className="pt-2 space-y-3">
                <label className="block font-bold text-black dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ListPlus className="w-4 h-4" />
                    <span>Bullet Action Points / Takeaways Checklist</span>
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-400">
                    ({bulletItems.length} points)
                  </span>
                </label>

                {/* Input for adding bullet point */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a bullet point or action item..."
                    value={newBulletText}
                    onChange={(e) => setNewBulletText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBulletItem();
                      }
                    }}
                    className="flex-1 px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-medium text-black dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddBulletItem()}
                    className="px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Point</span>
                  </button>
                </div>

                {/* Added Bullet Points List */}
                {bulletItems.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {bulletItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleToggleBulletInModal(item.id)}
                            className="cursor-pointer shrink-0"
                          >
                            {item.completed ? (
                              <CheckSquare className="w-4 h-4 text-black dark:text-white" />
                            ) : (
                              <Square className="w-4 h-4 text-zinc-400" />
                            )}
                          </button>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                            • {item.text}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveBulletItem(item.id)}
                          className="p-1 text-zinc-400 hover:text-black dark:hover:text-white rounded-lg cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold cursor-pointer"
                >
                  {editingNote ? 'Save Changes' : 'Save Meeting Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
