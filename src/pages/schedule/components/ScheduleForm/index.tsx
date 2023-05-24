import { useState } from 'react';

import { CalenderStep } from './CalenderStep';
import { ConfirmStep } from './ConfirmStep';

export const ScheduleForm = () => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  const handleClearSelectedDateTime = () => {
    setSelectedDateTime(null);
  };

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleClearSelectedDateTime}
      />
    );
  }

  return <CalenderStep onSelectedDateTime={setSelectedDateTime} />;
};
