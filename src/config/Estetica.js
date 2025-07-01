import React from 'react';
import { StyleSheet } from 'react-native';

export default StyleSheet.create(
    {
        app: {
            container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }
        },
        home: {
            container: { flex: 1 },
            titulo: { fontSize: 24, textAlign: 'center', marginBottom: 30 },
            botao: { marginVertical: 10, width: '100%' },
            logo: { width: 120, height: 120, marginBottom: 20, resizeMode: 'contain', borderRadius: 10 },
            centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }
        },
        sobre: {
            container: { flex: 1, padding: 20 },
            titulo: { fontSize: 20, marginBottom: 16 },
            botao: { marginTop: 20 }
        },
        eventos: {
            container: { flex: 1, padding: 20 },
            titulo: { fontSize: 20, marginBottom: 16 },
            botao: { marginVertical: 10, },
            fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, },
        },
        cursos: {
            container: { flex: 1, padding: 20 },
            titulo: { fontSize: 20, marginBottom: 16 }
        },
        cursoCard: {
            card: { marginBottom: 12 },
            nivel: { fontSize: 12, color: '#555', marginBottom: 4 },
            nome: { marginBottom: 10, color: '#1C9B5E' },
            info: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
            infoText: { marginLeft: 6, fontSize: 14 }
        },
        eventoCard: {
            card: { marginBottom: 12 },
            header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
            badge: { color: '#fff', paddingHorizontal: 10, fontSize: 12 },
            botaoInscricao: { marginTop: 16, alignSelf: 'flex-end' },
            carregandoTexto: { marginTop: 16, color: '#888', textAlign: 'center', },
            inscritoTexto: { marginTop: 16, color: '#2C98F0' },
            acoes: {
                flexDirection: 'row',       // ← Aqui é a chave do problema
                justifyContent: 'flex-start', // ou 'space-between' se quiser espaçar
                alignItems: 'center',
                marginTop: 8,
            },
            acaoItem: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,                      // Espaço entre ícone e texto
                marginRight: 16,            // Espaçamento entre os itens (opcional)
            }
        },
        detalheCurso: {
            container: { flex: 1, padding: 16 },
            card: { marginBottom: 16 },
            divisor: { marginVertical: 10 },
            subtitulo: { marginTop: 10, marginBottom: 4 },
            descricao: { marginTop: 8, lineHeight: 20 },
            botaoVoltar: { marginTop: 10 }
        },
        detalheEvento: {
            container: { padding: 16 },
            card: { marginBottom: 16 },
            header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
            badge: { color: '#fff', paddingHorizontal: 10, fontSize: 12 },
            divisor: { marginVertical: 12 },
            subtitulo: { marginBottom: 4 },
            descricao: { marginTop: 8, lineHeight: 20 },
            botaoVoltar: { marginTop: 10 },
            botaoInscricao: { marginTop: 16, alignSelf: 'flex-end', },
            botaoCancelarInscricao: { marginTop: 16, alignSelf: 'flex-end', backgroundColor: 'red', },
            acoes: {
                flexDirection: 'row',       // Alinha os botões horizontalmente
                justifyContent: 'space-around', // Distribui espaços entre eles
                paddingVertical: 12,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: 'rgba(0,0,0,0.1)',
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
                marginVertical: 16,
            },
            acaoItem: {
                flexDirection: 'row',
                gap: 1,                      // Espaço entre ícone e texto
            }
        },
        cadastro: {
            container: { padding: 24, flex: 1, justifyContent: 'center' },
            input: { marginBottom: 16 }
        },
        login: {
            container: { padding: 24, flex: 1, justifyContent: 'center' },
            input: { marginBottom: 16 }
        },
        novoEvento: {
            container: { padding: 24 },
            titulo: { marginBottom: 16 },
            input: { marginBottom: 12 },
            switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, },
            bloqueado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, },
        },
        novoCurso: {
            container: { padding: 24 },
            titulo: { marginBottom: 16 },
            input: { marginBottom: 12 },
            bloqueado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, }
        },
        perfil: {
            container: {
                padding: 16,
                backgroundColor: '#fff',
                flexGrow: 1,
            },
            form: {
                marginBottom: 20,
            },
            input: {
                marginBottom: 12,
            }
        }

    }

);