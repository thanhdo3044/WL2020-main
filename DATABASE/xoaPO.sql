update prod.OPENING_STOCK
set PO_ID = null
where PO_ID in (
select code
from prod.PO
where number = 5 or number = 100008
)
select *
from prod.OPENING_STOCK
where PO_ID in (
select code
from prod.PO
where number = 5 or number = 100008
)
delete from prod.PO where number = 5 or number = 100008