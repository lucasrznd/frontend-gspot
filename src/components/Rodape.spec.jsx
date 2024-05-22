import { render, screen } from "@testing-library/react";
import Rodape from "./Rodape";

describe('Rodape Component', () => {
    it('should render rodape component', () => {
        render(<Rodape/>)

        screen.getByText('EducadoraGS - Todos os direitos reservados.©');
    });
});