The container width fix applied to the homepage didn't carry over to the
rest of the site — every other page (During Your Stay articles, Decisions &
Next Steps articles, Medical Conditions articles and index, About) is still
using the old, narrower max-width.

This suggests the width change was made on the homepage template/component
specifically rather than in a shared layout. Find wherever the site's base
layout or shared container width is defined and update it there, so the
change applies globally instead of needing to be repeated per page type.

All pages should use the same max-width as the homepage now uses. Check each
page type after the change (an article page, the Medical Conditions index,
About) to confirm the width is actually consistent site-wide, not just
"looks right on the homepage."
