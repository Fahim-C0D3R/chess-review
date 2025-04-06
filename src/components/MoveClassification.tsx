import { MoveAnalysis } from '../types/types';

interface MoveClassificationProps {
  classification: MoveAnalysis['classification'];
}

export default function MoveClassification({ classification }: MoveClassificationProps) {
  const getClassDetails = () => {
    switch (classification) {
      case 'brilliant':
        return { className: 'brilliant', label: 'Brilliant', emoji: '✨' };
      case 'great':
        return { className: 'great', label: 'Great', emoji: '👍' };
      case 'good':
        return { className: 'good', label: 'Good', emoji: '✓' };
      case 'inaccuracy':
        return { className: 'inaccuracy', label: 'Inaccuracy', emoji: '?!' };
      case 'mistake':
        return { className: 'mistake', label: 'Mistake', emoji: '?' };
      case 'blunder':
        return { className: 'blunder', label: 'Blunder', emoji: '??' };
      default:
        return { className: '', label: '', emoji: '' };
    }
  };
  
  const { className, label, emoji } = getClassDetails();
  
  return (
    <div className={`move-classification ${className}`}>
      <span className="emoji">{emoji}</span>
      <span className="label">{label}</span>
    </div>
  );
}
