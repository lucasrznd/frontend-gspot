import { render, screen } from "@testing-library/react";
import AppFooter from "./AppFooter";

describe('Rodape Component', () => {
    it('should render rodape component', () => {
        render(<AppFooter />)

        screen.getByText('EducadoraGS - Todos os direitos reservados.©');
    });
});