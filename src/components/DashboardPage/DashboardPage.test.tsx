import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom';
import DashboardPage from './Page';
import DashboardElement from '../DashboardElement/DashboardElement';
import { MemoryRouter } from 'react-router-dom';

// TODO : test l'affichage des DashboardElement et les filtres radio
// TOFIX : DashboardElement sans rien a l'intérieur n'affiche rien


describe("DashboardPage Component", () => {
    beforeAll(() => { // https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: jest.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // Deprecated
            removeListener: jest.fn(), // Deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          })),
        });
      });
    
    test("initial state", async () => {
        // Génération DOM virtuel et sélection des noeuds
        render(
            <MemoryRouter>
                <DashboardPage>
                    <DashboardElement title = "Graphique 1" section='Section 1'>
                        <></>
                    </DashboardElement>
                    <DashboardElement title = "Graphique 2" section='Section 2'>
                        <></>
                    </DashboardElement>
                </DashboardPage>
            </MemoryRouter>

        );

        // Assertions
        expect(screen.getByRole('radio', { name: "Section 1" })).toBeInTheDocument();
        expect(screen.queryByRole('radio', { name: "Section 3" })).not.toBeInTheDocument();
        expect(screen.queryByRole('radio', { name: "Autres" })).not.toBeInTheDocument();

        expect(screen.getAllByRole('radio')).toHaveLength(2);


    });

    test("Others section", async () => {

        render(
            <MemoryRouter>
                <DashboardPage>
                    <DashboardElement title = "Graphique 1" section='Section 1'>
                        <></>
                    </DashboardElement>
                    <DashboardElement title = "Graphique 2" section='Section 2'>
                        <></>
                    </DashboardElement>
                    <DashboardElement title = "Graphique 3">
                        <></>
                    </DashboardElement>
                </DashboardPage>
            </MemoryRouter>

        )

        // Assertions
        expect(screen.queryByRole('radio', { name: "Autres" })).toBeInTheDocument();

        expect(screen.getAllByRole('radio')).toHaveLength(3);

    })
});