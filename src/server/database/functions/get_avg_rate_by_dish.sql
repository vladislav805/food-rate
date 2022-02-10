create function `get_avg_rate_by_dish` (dish_id int) returns float begin
    declare `l_rate` float;
    select avg(`rate`) into `l_rate` from `review` where `dishId` = `dish_id`;
    return ifnull(`l_rate`, 0);
end
