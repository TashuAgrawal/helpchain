import React from 'react';
import { Activity, Building2, DollarSign, Users } from 'lucide-react';

interface StatCardsProps {
  totalDonations: number;
  totalActiveNGOs: number;
  totalUsers: number;
  pendingNGOs: number;
}

const cards = [
  {
    label: 'Total Donations',
    icon: DollarSign,
    gradient: 'from-indigo-500/20 to-indigo-600/10',
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
    border: 'border-indigo-500/20',
    valueColor: 'text-indigo-300',
    key: 'totalDonations',
    prefix: '$',
  },
  {
    label: 'Active NGOs',
    icon: Building2,
    gradient: 'from-emerald-500/20 to-emerald-600/10',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    border: 'border-emerald-500/20',
    valueColor: 'text-emerald-300',
    key: 'totalActiveNGOs',
    prefix: '',
  },
  {
    label: 'Total Users',
    icon: Users,
    gradient: 'from-violet-500/20 to-violet-600/10',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
    border: 'border-violet-500/20',
    valueColor: 'text-violet-300',
    key: 'totalUsers',
    prefix: '',
  },
  {
    label: 'Pending Approvals',
    icon: Activity,
    gradient: 'from-amber-500/20 to-amber-600/10',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    border: 'border-amber-500/20',
    valueColor: 'text-amber-300',
    key: 'pendingNGOs',
    prefix: '',
  },
] as const;

const StatCards: React.FC<StatCardsProps> = ({ totalDonations, totalActiveNGOs, totalUsers, pendingNGOs }) => {
  const values: Record<string, number> = { totalDonations, totalActiveNGOs, totalUsers, pendingNGOs };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const raw = values[card.key];
        const display = card.prefix === '$' ? `$${raw.toLocaleString()}` : raw.toLocaleString();
        return (
          <div
            key={card.key}
            className={`stagger-card relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} border ${card.border} p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
          >
            {/* Subtle glow orb */}
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${card.iconBg} blur-2xl opacity-60 group-hover:opacity-90 transition-opacity`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">{card.label}</p>
                <p className={`text-3xl font-bold ${card.valueColor} tabular-nums`}>{display}</p>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
