-- ============================================================
--  SEED — 16 livros do catálogo (mesmos do protótipo)
--  Rode DEPOIS do schema.sql. Pode rodar de novo (upsert por slug).
--  Obs.: cover_path/pdf_path ficam nulos até você subir os arquivos
--  pelo painel admin.
-- ============================================================

insert into public.books
  (slug, titulo, autora, tags, sinopse, paginas, ano, nota, capa_de, capa_para, selo, destaque, novo, lancado_em)
values
  ('desenfreados', 'Desenfreados', 'Kelly M.',
   array['Máfia Romance','Possessivo'],
   'Ela foi prometida ao chefão como pagamento de uma dívida de sangue. Ele jurou nunca amar — mas ninguém foge do que já pertence à família.',
   748, 2024, 4.8, '#3a0810', '#c0303f', 'Edição especial', true, true, '2026-08-13'),

  ('perseguindo-adeline', 'Perseguindo Adeline', 'H. D. Carlton',
   array['Inimigos para Amantes','Vingança'],
   'Ela se aproximou para destruí-lo. Ele percebeu tarde demais que já a queria por perto — mesmo sabendo que ela seria sua ruína.',
   587, 2024, 4.6, '#2a0510', '#a11d2e', 'Gato e Rato · Vol. II', false, true, '2026-08-12'),

  ('assombrando-adeline', 'Assombrando Adeline', 'H. D. Carlton',
   array['Bilionário Sombrio','Possessivo'],
   'Ele comprou o hotel, a cidade e o silêncio dela. O que não conseguiu comprar foi o direito de esquecê-la ao amanhecer.',
   635, 2023, 4.7, '#1a0a04', '#d9b26a', 'Gato e Rato · Vol. I', true, false, null),

  ('garotos-crueis-perseguem-voce', 'Garotos Cruéis Perseguem Você', 'Red R',
   array['Motoqueiros','Dark & Forbidden'],
   'O clube tinha regras, e a primeira era não tocar na filha do presidente. Ele quebrou todas na mesma noite de chuva.',
   719, 2024, 4.5, '#20060a', '#7a0f1c', 'Red R · Vol. III', false, true, '2026-08-11'),

  ('cutelo-e-corvo', 'Cutelo & Corvo', 'Brynne Weaver',
   array['Máfia Romance','Dark & Forbidden'],
   'Ela testemunhou o que não devia. A única forma de continuar viva era pertencer ao homem que puxou o gatilho.',
   318, 2023, 4.9, '#2a0510', '#5c0a14', 'Amor Ruinoso · Vol. I', true, false, null),

  ('garotas-crueis-merecem-pagar', 'Garotas Cruéis Merecem Pagar', 'Red R',
   array['Vingança','Inimigos para Amantes'],
   'Sete anos planejando a queda dele. Um único olhar para lembrar por que o odiava — e por que nunca conseguiu parar de desejá-lo.',
   595, 2024, 4.4, '#12060a', '#c0303f', 'Red R · Vol. I', false, true, '2026-08-09'),

  ('insatiable', 'Insatiable', 'Leigh Rivers',
   array['Dark & Forbidden','Possessivo'],
   'Ele deveria salvá-la da tentação. Em vez disso, tornou-se o pecado que ela repetia toda noite em oração.',
   250, 2023, 4.7, '#0f0608', '#a11d2e', 'Windsor · Vol. I', false, false, null),

  ('herdeira-do-fogo', 'Herdeira do Fogo', 'Marina Kess',
   array['Máfia Romance','Vingança'],
   'Mataram o pai dela e deram o império a ele. Ela voltou não para reaver o trono — mas para queimá-lo junto com o rei.',
   455, 2024, 4.8, '#26070c', '#d94452', 'Duologia Belladonna', false, false, null),

  ('contrato-de-meia-noite', 'Contrato de Meia-Noite', 'Cora Bane',
   array['Bilionário Sombrio','Inimigos para Amantes'],
   'Doze meses, uma aliança falsa e uma cláusula proibida: não se apaixonar. Nenhum dos dois leu as letras miúdas.',
   368, 2023, 4.5, '#1a0a04', '#b8914c', 'Coleção Midas', false, false, null),

  ('presa-favorita', 'Presa Favorita', 'Selene Ravn',
   array['Possessivo','Dark & Forbidden'],
   'Ele a deixou fugir só pela emoção da caçada. O erro foi deixá-la perceber que gostava de ser encontrada.',
   331, 2024, 4.3, '#14060a', '#7a0f1c', 'Standalone', false, true, '2026-08-10'),

  ('cinzas-de-um-rei', 'Cinzas de um Rei', 'Helena Voss',
   array['Máfia Romance','Vingança'],
   'A guerra entre as famílias tinha um único termo de paz: o casamento deles. Ninguém avisou que o amor também mata.',
   447, 2022, 4.6, '#2a0510', '#a11d2e', 'Império Corvi · Vol. III', false, false, null),

  ('luar-carmesim', 'Luar Carmesim', 'Dahlia Crowe',
   array['Sobrenatural','Dark & Forbidden'],
   'Ela cruzou o pacto que selava a cidade. Do outro lado, ele esperava há um século — faminto por ela e apenas por ela.',
   398, 2024, 4.4, '#0a0810', '#8a2f6a', 'Ordem da Noite', false, false, null),

  ('a-divida', 'A Dívida', 'Marina Kess',
   array['Máfia Romance','Possessivo'],
   'O irmão dela apostou o que não tinha. O pagamento veio em forma de um contrato — e do homem que passou a chamá-la de sua.',
   372, 2023, 4.7, '#20060a', '#c0303f', 'Standalone', false, false, null),

  ('refens-do-desejo', 'Reféns do Desejo', 'Cora Bane',
   array['Inimigos para Amantes','Motoqueiros'],
   'Sequestrada por engano, ela virou moeda de troca entre dois clubes. E o único que a protegia era o que mais deveria temer.',
   355, 2024, 4.2, '#14060a', '#d94452', 'Ferro & Cinzas MC', false, true, '2026-08-12'),

  ('senhor-da-tempestade', 'Senhor da Tempestade', 'Ísis Marlowe',
   array['Bilionário Sombrio','Possessivo'],
   'Ele controla mercados com um telefonema e pessoas com um olhar. Ela foi a primeira variável que ele não conseguiu prever.',
   421, 2022, 4.6, '#1a0a04', '#d9b26a', 'Coleção Midas', false, false, null),

  ('oracao-para-um-monstro', 'Oração para um Monstro', 'Dahlia Crowe',
   array['Dark & Forbidden','Vingança'],
   'Disseram que ele era um monstro. Ela concordou — logo depois de decidir que seria a única a domá-lo.',
   409, 2024, 4.8, '#12060a', '#a11d2e', 'Trilogia Ígnea', true, false, null)

on conflict (slug) do update set
  titulo     = excluded.titulo,
  autora     = excluded.autora,
  tags       = excluded.tags,
  sinopse    = excluded.sinopse,
  paginas    = excluded.paginas,
  ano        = excluded.ano,
  nota       = excluded.nota,
  capa_de    = excluded.capa_de,
  capa_para  = excluded.capa_para,
  selo       = excluded.selo,
  destaque   = excluded.destaque,
  novo       = excluded.novo,
  lancado_em = excluded.lancado_em;
