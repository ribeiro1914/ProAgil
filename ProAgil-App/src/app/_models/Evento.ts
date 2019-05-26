import { Lote } from './Lote';
import { RedeSocial } from './RedeSocial';
import { Palestrante } from './Palestrante';

export interface Evento {
    eventoId: number;
    local: string;
    dataEvento: Date;
    qtdPessoas: number;
    tema: string;
    imagemURL: string;
    telefone: string;
    email: string;
    lote: string;
    lotes: Lote[];
    redeSociais: RedeSocial[];
    palestranteEvento: Palestrante[];
}
