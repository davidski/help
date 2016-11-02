Violation Exploration
================

``` r
library(tidyverse)
```

    ## Loading tidyverse: ggplot2
    ## Loading tidyverse: tibble
    ## Loading tidyverse: tidyr
    ## Loading tidyverse: readr
    ## Loading tidyverse: purrr
    ## Loading tidyverse: dplyr

    ## Conflicts with tidy packages ----------------------------------------------

    ## filter(): dplyr, stats
    ## lag():    dplyr, stats

``` r
library(feather)
library(lubridate)
```

    ## 
    ## Attaching package: 'lubridate'

    ## The following object is masked from 'package:base':
    ## 
    ##     date

``` r
violations <- read_feather("./data/osha_violation.feather")
```

Exploring the violation data per a conversation on the meaning of the Standard column.

``` r
filter(violations, viol_type == "S") %>% 
  count(year = year(issuance_date), sort = TRUE) %>% 
  ggplot(aes( x = year, y = n)) + geom_line() +
  theme_minimal()
```

![](violation_exploration_files/figure-markdown_github/severe_violations-1.png)

``` r
violations %>% mutate(known = grepl("^19", standard)) %>% 
  count(known, standard, sort = TRUE)
```

    ## Source: local data frame [113,278 x 3]
    ## Groups: known [2]
    ## 
    ##    known     standard      n
    ##    <lgl>        <chr>  <int>
    ## 1   TRUE 19101200 E01 184326
    ## 2   TRUE 19100212 A01 132797
    ## 3   TRUE 19100215 B09 105919
    ## 4   TRUE 19100219 D01 100010
    ## 5   TRUE   19040002 A  88755
    ## 6   TRUE   19260100 A  88754
    ## 7   TRUE   19101200 H  87902
    ## 8   TRUE 19100215 A04  86896
    ## 9   TRUE 19100023 C01  81982
    ## 10  TRUE 19030002 A01  81182
    ## # ... with 113,268 more rows

``` r
filter(violations, nr_exposed >= 1) %>% 
  mutate(year_issued = year(issuance_date)) %>% 
  filter(year_issued > 2009) %>% 
  ggplot(., aes(x=nr_exposed)) + geom_histogram() +
  facet_grid(. ~ year_issued, scales = "free_x")
```

    ## `stat_bin()` using `bins = 30`. Pick better value with `binwidth`.

![](violation_exploration_files/figure-markdown_github/unnamed-chunk-1-1.png)
