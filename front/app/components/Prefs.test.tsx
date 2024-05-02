import { describe, test, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Prefs } from './Prefs';

describe('Prefs', () => {
    const setPrefs = vi.fn()
    let selectedPrefs: pref[] = [];
    const prefs = [
        { prefCode: 1, prefName: 'Pref 1' },
        { prefCode: 2, prefName: 'Pref 2' },
        { prefCode: 3, prefName: 'Pref 3' },
    ];
    
    afterEach(() => {
        vi.clearAllMocks();
        selectedPrefs = [];
    })

    test('renders the component', () => {
        render(<Prefs
            setPrefs={setPrefs}
            selectedPrefs={selectedPrefs}
            prefs={prefs}
            />);
        const prefElements = screen.getAllByRole('checkbox');
        expect(prefElements).toHaveLength(prefs.length);
    });

    test('adds a pref to selectedPrefs when checkbox is checked', () => {
        render(<Prefs
            setPrefs={setPrefs}
            selectedPrefs={selectedPrefs}
            prefs={prefs}
            />);
        const checkbox = screen.getByLabelText('Pref 1');
        fireEvent.click(checkbox);
        
        expect(setPrefs).toHaveBeenCalledWith([{ prefCode: 1, prefName: 'Pref 1' }]);
    });

    test('removes a pref from selectedPrefs when checkbox is unchecked', async () => {
        selectedPrefs = [{ prefCode: 1, prefName: 'Pref 1' }];
        render(<Prefs
            setPrefs={setPrefs}
            selectedPrefs={selectedPrefs}
            prefs={prefs}
            />);
        const checkbox = screen.getByLabelText('Pref 1');
        fireEvent.click(checkbox); // Uncheck the checkbox
        expect(setPrefs).toHaveBeenCalledWith([])
    });
    
    test('removes a pref from selectedPrefs when checkbox is unchecked', () => {
        render(<Prefs
            setPrefs={setPrefs}
            selectedPrefs={selectedPrefs}
            prefs={prefs}
            />);
        const checkbox = screen.getByLabelText('Pref 1');
        fireEvent.click(checkbox); // Check the checkbox
        expect(setPrefs).toHaveBeenCalledWith([{ prefCode: 1, prefName: 'Pref 1' }]);

        const checkbox2 = screen.getByLabelText('Pref 2');
        fireEvent.click(checkbox2); // Check the checkbox

        expect(setPrefs).toHaveBeenCalledWith([{ prefCode: 2, prefName: 'Pref 2' }]);
    });
    
});
