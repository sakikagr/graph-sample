import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Chart, Graph} from './Graph';
import '@testing-library/jest-dom/vitest';

describe('Chart', () => {
  const population = [
    {
      label: '総人口',
      prefCode: 1,
      prefName: 'Pref 1',
      data: [
        { year: 2020, value: 100 },
        { year: 2021, value: 150 },
      ],
    },
    {
      label: '総人口',
      prefCode: 1,
      prefName: 'Pref 2',
      data: [
        { year: 2020, value: 200 },
        { year: 2021, value: 250 },
      ],
    },
  ];

  beforeEach(() => {
    // @see https://github.com/recharts/recharts/issues/2982
    vi.mock('recharts', async () => {
      const OriginalModule = await vi.importActual('recharts');
      return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
          <OriginalModule.ResponsiveContainer width={'100%'} height={400}>
            {children}
          </OriginalModule.ResponsiveContainer>
        ),
      };
    });
    
    global.ResizeObserver = class ResizeObserver {
      observe() {
        // do nothing
      }
      unobserve() {
        // do nothing
      }
      disconnect() {
        // do nothing
      }
    };
  });

  afterEach(() => {
      vi.clearAllMocks();
  })
  
  test('renders the component', async () => {
      render(<Chart population={population} />);
      await waitFor(() => {
        const chartElement = screen.getByTestId('chart-inner');
        expect(chartElement).toBeInTheDocument();
      }, { interval: 1000 })
  });
});

describe('Graph', () => {
  let selectedPrefs: pref[] = [
    { prefCode: 1, prefName: 'Pref 1' },
    { prefCode: 2, prefName: 'Pref 2' },
  ];

  const population = [
    {
      label: '総人口',
      prefCode: 1,
      prefName: 'Pref 1',
      data: [
        { year: 2020, value: 100 },
        { year: 2021, value: 150 },
      ],
    },
    {
      label: '総人口',
      prefCode: 2,
      prefName: 'Pref 2',
      data: [
        { year: 2020, value: 200 },
        { year: 2021, value: 250 },
      ],
    },
  ];

  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {
        // do nothing
      }
      unobserve() {
        // do nothing
      }
      disconnect() {
        // do nothing
      }
    };
  });

test('renders the component with no selected preferences', () => {
    selectedPrefs = [];
    render(<Graph {...selectedPrefs} />);
    const messageElement = screen.getByText('都道府県を選択してください');
    expect(messageElement).toBeInTheDocument();
    const chartElement = screen.queryByTestId('chart');
    expect(chartElement).not.toBeInTheDocument();
});

test('renders the component with selected preferences', async () => {
    selectedPrefs = [
      { prefCode: 1, prefName: 'Pref 1' },
      { prefCode: 2, prefName: 'Pref 2' },
    ];
   
    render(<Graph {...selectedPrefs} />);
    await waitFor(() => {
        const messageElement = screen.queryByText('都道府県を選択してください');
        expect(messageElement).not.toBeInTheDocument();
        const chartElement = screen.getByTestId('chart');
        expect(chartElement).toBeInTheDocument();
    })
});

  test('fetches population data for each selected preference', async () => {
    selectedPrefs = [
      { prefCode: 1, prefName: 'Pref 1' },
      { prefCode: 2, prefName: 'Pref 2' },
    ];

    const mockFetch = vi.fn().mockResolvedValue({ json: () => Promise.resolve({ result: { data: [] } }) });
    global.fetch = mockFetch;

    render(<Graph {...selectedPrefs} />);

    await screen.findByTestId('chart');

    expect(mockFetch).toHaveBeenCalledTimes(selectedPrefs.length);
    selectedPrefs.forEach((pref) => {
      expect(mockFetch).toHaveBeenCalledWith(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${pref.prefCode}`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-API-KEY': expect.any(String),
          },
        })
      );
    });
  });

  test('renders the chart with correct population data', async () => {
    selectedPrefs = [
      { prefCode: 1, prefName: 'Pref 1' },
      { prefCode: 2, prefName: 'Pref 2' },
    ];

    const mockFetch = vi.fn().mockResolvedValue({ json: () => Promise.resolve({ result: { data: population } }) });
    global.fetch = mockFetch;

    render(<Graph {...selectedPrefs} />);

    const chartElement = await screen.findByTestId('chart');

    await waitFor(() => {
        expect(chartElement).toBeInTheDocument();
    })
  });
});
