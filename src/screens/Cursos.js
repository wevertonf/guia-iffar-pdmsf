import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import Estetica from '../config/Estetica';
import CursoCard from '../componentes/CursoCard';
import {supabase} from '../config/supabase';
/* 
const cursos_db = [
  {
    nome: 'Técnico em Informática',
    modalidade: 'Integrado',
    nivel: 'Técnico de Nível Médio',
    turno: 'Manhã',
    unidade: 'IFFar - Campus Panambi',
    duracao: '3 anos (1800h)',
    descricao:
      'O curso técnico em informática forma profissionais capazes de desenvolver sistemas, websites e realizar manutenção em computadores. Abrange disciplinas de programação, redes, banco de dados e lógica computacional.'
  },
  {
    nome: 'Sistemas para Internet',
    modalidade: 'Presencial',
    nivel: 'Graduação / Tecnologia',
    turno: 'Noite',
    unidade: 'IFFar - Campus Panambi',
    duracao: '3 anos (1898h)',
    descricao:
      'O tecnólogo em Sistemas para Internet desenvolve soluções web, apps e sistemas em nuvem. Atua com banco de dados, interfaces responsivas, segurança digital e tecnologias modernas do mercado.'
  },
];
*/
export default ({ navigation }) => {
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarCursos() {
      const {data, error} = await supabase.from('cursos').select('*');

      if (error) {
        console.error('Erro ao buscar cursos:', error);
        setErro('Não foi possível carregar os cursos. Tente novamente mais tarde.');
      } else {
        console.log(data);
        setCursos(data);
      }
      setCarregando(false);  
    }
    buscarCursos();
  }, []);

  return (
    <ScrollView contentContainerStyle={Estetica.cursos.container}>
      <Text variant='titleLarge' style={Estetica.cursos.titulo}>Lista de Cursos</Text>

      {carregando && <ActivityIndicator animating />}

      {erro && <Text style={{ color: 'red', textAlign: 'center' }}>{erro}</Text>}

      {!carregando && cursos.length === 0 && (
      <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum curso disponível.</Text>
      )}

      {/* {cursos_db.map((curso, index) => ( */}
      {cursos.map((curso) => (
        <CursoCard key={curso.id/* index */} {...curso} onPress={() => navigation.navigate('DetalheCurso', curso)} />
      ))}
    </ScrollView>
  );
}


/* 
key={index}: A propriedade key é necessária para ajudar o React a identificar quais itens mudaram,
foram adicionados ou removidos. Aqui, estamos usando o índice do curso como chave, o que pode não ser ideal em todos os casos,
mas é aceitável se a lista não mudar. 

Sugestões de Melhoria
Tratamento de Erros: Considere adicionar uma mensagem de erro na interface do usuário, caso a busca de cursos falhe. Isso melhora a experiência do usuário.

const [erro, setErro] = useState(null);
...
if (error) {
  setErro('Não foi possível carregar os cursos. Tente novamente mais tarde.');
}

Placeholder para Carregamento: Em vez de apenas mostrar um indicador de carregamento, você poderia adicionar um texto informativo que diz "Carregando cursos...".

Melhorar a Chave do CursoCard: Se o ID do curso não for único em todas as chamadas, considere usar um identificador mais único, como uma combinação de ID e índice, ou garantir que o ID seja realmente único.

Limpeza de Efeitos: Considere adicionar uma função de limpeza no useEffect para evitar atualizações de estado se o componente for desmontado antes da conclusão da chamada assíncrona.



*/