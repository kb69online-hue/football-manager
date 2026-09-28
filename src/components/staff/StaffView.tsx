import React from 'react';
import { useGame } from '../../context/GameContext';
import { UserCheck, Award, HeartPulse, Binoculars, Compass, GraduationCap } from 'lucide-react';

export const StaffView: React.FC = () => {
  const { state } = useGame();
  const staff = state.staff;

  const roleIcons: Record<string, any> = {
    'Assistant Manager': Compass,
    'Head Scout': Binoculars,
    'Chief Physio': HeartPulse,
    'Fitness Coach': Award,
    'Youth Director': GraduationCap,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
              Backroom Staff
            </span>
            <span className="text-xs text-slate-400">Coaching, Scouting & Medical Departments</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Staff Management</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => {
          const Icon = roleIcons[member.role] || UserCheck;
          return (
            <div
              key={member.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white bg-slate-800 border border-slate-700">
                  {member.role}
                </span>
                <span className="text-sm font-black text-emerald-400 font-mono">{member.rating}/100</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{member.name}</h4>
                  <span className="text-xs text-slate-400">
                    {member.nationality} • {member.age} y/o
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Specialty</span>
                <p className="text-slate-300 font-medium">{member.specialty}</p>
                <div className="flex justify-between pt-2 text-slate-400 text-[11px]">
                  <span>Weekly Salary:</span>
                  <span className="font-mono text-slate-200">€{(member.salaryWeekly / 1000).toFixed(0)}k/wk</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
