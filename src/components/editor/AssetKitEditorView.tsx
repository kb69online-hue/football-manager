import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AssetItem, KitDesign } from '../../types/football';
import {
  generateClubBadgeSvg,
  generatePersonAvatarSvg,
  generateKitSvg,
  INITIAL_PRESET_ASSETS,
} from '../../services/assetService';
import {
  Palette,
  Shield,
  User,
  Shirt,
  Sparkles,
  Download,
  Copy,
  Check,
  FileCheck,
  Plus,
} from 'lucide-react';

export const AssetKitEditorView: React.FC = () => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<'kits' | 'crests' | 'avatars' | 'licensing'>('kits');

  // Kit Editor State
  const [kitType, setKitType] = useState<'home' | 'away' | 'third' | 'gk'>('home');
  const [primaryColor, setPrimaryColor] = useState('#DC2626');
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');
  const [accentColor, setAccentColor] = useState('#1E293B');
  const [pattern, setPattern] = useState<'solid' | 'stripes' | 'hoops' | 'sash' | 'halves'>('stripes');
  const [collarStyle, setCollarStyle] = useState<'round' | 'v-neck' | 'polo'>('v-neck');
  const [numberColor, setNumberColor] = useState('#FFFFFF');

  // Crest Generator State
  const [crestName, setCrestName] = useState('London Monarchs');
  const [crestPrimaryColor, setCrestPrimaryColor] = useState('#DC2626');
  const [crestSecondaryColor, setCrestSecondaryColor] = useState('#FFFFFF');
  const [crestShape, setCrestShape] = useState<'shield' | 'circle' | 'diamond'>('shield');

  // Avatar Generator State
  const [avatarName, setAvatarName] = useState('Marcus Vance');
  const [avatarSkin, setAvatarSkin] = useState('#F6D8B8');
  const [avatarHair, setAvatarHair] = useState('#18181B');
  const [avatarKit, setAvatarKit] = useState('#DC2626');

  const currentKit: KitDesign = {
    type: kitType,
    primaryColor,
    secondaryColor,
    accentColor,
    pattern,
    collarStyle,
    shortColor: secondaryColor,
    sockColor: primaryColor,
    numberColor,
  };

  const renderedKitSvg = generateKitSvg(currentKit);
  const renderedCrestSvg = generateClubBadgeSvg(crestName, crestPrimaryColor, crestSecondaryColor, '#FFFFFF', crestShape);
  const renderedAvatarSvg = generatePersonAvatarSvg(avatarName, avatarHair, avatarSkin, avatarKit);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">Kit Designer & Asset Generator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Craft original licensed kits, procedural club crests, and copyright-free player/manager avatars.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveTab('kits')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'kits' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Kit Designer</span>
          </button>
          <button
            onClick={() => setActiveTab('crests')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'crests' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Club Crests</span>
          </button>
          <button
            onClick={() => setActiveTab('avatars')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'avatars' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Avatars</span>
          </button>
          <button
            onClick={() => setActiveTab('licensing')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'licensing' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Licensing Ledger</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'kits' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
              Kit Customization Panel
            </h3>

            {/* Kit Type */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Kit Variant</label>
              <div className="grid grid-cols-4 gap-2 font-mono">
                {(['home', 'away', 'third', 'gk'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setKitType(t)}
                    className={`py-1.5 rounded-xl font-bold uppercase transition border ${
                      kitType === t ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Fabric Pattern</label>
              <div className="grid grid-cols-5 gap-2 font-mono">
                {(['solid', 'stripes', 'hoops', 'sash', 'halves'] as const).map((pat) => (
                  <button
                    key={pat}
                    onClick={() => setPattern(pat)}
                    className={`py-1.5 rounded-xl font-bold capitalize transition border ${
                      pattern === pat ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {pat}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selectors */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Primary Color</label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-slate-200">{primaryColor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Secondary Color</label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-slate-200">{secondaryColor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Number Color</label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={numberColor}
                    onChange={(e) => setNumberColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-slate-200">{numberColor}</span>
                </div>
              </div>
            </div>

            {/* Collar Style */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Collar Cut</label>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {(['round', 'v-neck', 'polo'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCollarStyle(c)}
                    className={`py-1.5 rounded-xl font-bold uppercase transition border ${
                      collarStyle === c ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-xl">
            <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Live Vector Render</h4>
            <div
              className="w-48 h-48 flex items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner"
              dangerouslySetInnerHTML={{ __html: renderedKitSvg }}
            />
            <div className="text-center font-mono text-xs text-slate-400">
              <span className="font-bold text-white block capitalize">{kitType} Kit • {pattern} Design</span>
              <span>Generated SVG Asset • License: Original</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'crests' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
              Club Crest Procedural Generator
            </h3>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Club Name (for initials)</label>
              <input
                type="text"
                value={crestName}
                onChange={(e) => setCrestName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Shield Geometry</label>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {(['shield', 'circle', 'diamond'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setCrestShape(s)}
                    className={`py-1.5 rounded-xl font-bold uppercase transition border ${
                      crestShape === s ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Primary Color</label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={crestPrimaryColor}
                    onChange={(e) => setCrestPrimaryColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-slate-200">{crestPrimaryColor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Secondary Trim Color</label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={crestSecondaryColor}
                    onChange={(e) => setCrestSecondaryColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-slate-200">{crestSecondaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-xl">
            <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Crest Preview</h4>
            <div
              className="w-44 h-44 flex items-center justify-center p-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner"
              dangerouslySetInnerHTML={{ __html: renderedCrestSvg }}
            />
            <div className="text-center font-mono text-xs text-slate-400">
              <span className="font-bold text-white block">{crestName}</span>
              <span>100% Original Vector Badge</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'avatars' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
              Copyright-Free Person Avatar Generator
            </h3>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Player or Coach Name</label>
              <input
                type="text"
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Skin Tone</label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={avatarSkin}
                    onChange={(e) => setAvatarSkin(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-slate-200">{avatarSkin}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Hair Color</label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={avatarHair}
                    onChange={(e) => setAvatarHair(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-slate-200">{avatarHair}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Collar/Kit Color</label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={avatarKit}
                    onChange={(e) => setAvatarKit(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-slate-200">{avatarKit}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-xl">
            <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Avatar Preview</h4>
            <div
              className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center p-2 bg-slate-950 border border-slate-800 shadow-inner"
              dangerouslySetInnerHTML={{ __html: renderedAvatarSvg }}
            />
            <div className="text-center font-mono text-xs text-slate-400">
              <span className="font-bold text-white block">{avatarName}</span>
              <span>Procedural Geometric Face</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'licensing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">Asset Licensing Compliance Ledger</h3>
              <p className="text-xs text-slate-400">
                Full transparency on asset ownership, licensing status, and procedural fallbacks.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
              All Assets Verified & Compliant
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Asset ID</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Asset Name</th>
                  <th className="py-2.5 px-4">License Classification</th>
                  <th className="py-2.5 px-4">Source Provider</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {INITIAL_PRESET_ASSETS.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-300">{asset.id}</td>
                    <td className="py-3 px-4 uppercase text-slate-400">{asset.type}</td>
                    <td className="py-3 px-4 font-bold text-white">{asset.name}</td>
                    <td className="py-3 px-4 text-emerald-400">{asset.license}</td>
                    <td className="py-3 px-4 text-slate-400">{asset.source}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">✓ Active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
