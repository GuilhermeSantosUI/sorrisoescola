import type { Modulo } from '../../types';
import { escovacao } from './escovacao';
import { fioDental } from './fio-dental';
import { alimentacao } from './alimentacao';
import { dentista } from './dentista';

export const modulos: Modulo[] = [escovacao, fioDental, alimentacao, dentista];
