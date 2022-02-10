create function `get_count_rate_by_dish` (dish_id int) returns int begin
    declare `l_count` int;
select count(*) into `l_count` from `review` where `dishId` = `dish_id`;
return `l_count`;
end