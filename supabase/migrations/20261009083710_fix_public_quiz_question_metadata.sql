create or replace function public.get_quiz(p_code text)
returns jsonb
language sql
security definer
set search_path to ''
as $function$
  select jsonb_build_object(
    'id', q.id,
    'share_code', q.share_code,
    'creator', q.creator,
    'title', q.title,
    'category', q.category,
    'questions', (
      select jsonb_agg(
        jsonb_build_object(
          'question', question_rows.item->>'question',
          'options', question_rows.item->'options',
          'image', question_rows.item->>'image',
          'hint', question_rows.item->>'hint',
          'imageCaption', question_rows.item->>'imageCaption',
          'difficulty', coalesce(nullif(question_rows.item->>'difficulty', ''), 'medium'),
          'vibe', coalesce(nullif(question_rows.item->>'vibe', ''), q.category)
        )
        order by question_rows.ordinality
      )
      from jsonb_array_elements(q.questions) with ordinality as question_rows(item, ordinality)
    )
  )
  from public.quizzes q
  where q.share_code = upper(trim(p_code));
$function$;
