# 릴리즈노트

## 고도몰 릴리즈노트

#### 기능 추가

* HIGH-09 이미지 URL SSRF - MyappApi.php
* SQL Injection — moveBdId (게시판)
* SQL Injection — LIKE/BETWEEN/IN 직접 연결 (ArticleListAdmin, MemoAdmin)
* SQL Injection — UPDATE/DELETE 직접 연결 GoodsAdmin.php
* Reflected XSS — bdId 파라미터 JS 탈출 (ArticleViewController)
* SQL Injection — 동적 테이블명 삽입 (BoardReport.php)
* SQL Injection — replyStatus (게시판)
* SQL Injection — getCount 미이스케이프 (ExternalOrder.php)

## 소스 변경 비교 (godo25)

* 변경 파일 수: 18개

### 변경 파일 목록

| 상태 | 파일 경로                                                  |
| -- | ------------------------------------------------------ |
| M  | `Admin/marketing/naver_config.php`                     |
| M  | `Admin/share/layer_naver_stats.php`                    |
| M  | `Component/Board/ArticleListAdmin.php`                 |
| M  | `Component/Board/Board.php`                            |
| M  | `Component/Board/BoardReport.php`                      |
| M  | `Component/Goods/GoodsAdmin.php`                       |
| M  | `Component/Marketing/DBUrl.php`                        |
| M  | `Component/Marketing/DefineMarketing.php`              |
| M  | `Component/Memo/MemoAdmin.php`                         |
| M  | `Component/Order/ExternalOrder.php`                    |
| M  | `Component/Worker/AbstractDbUrl.php`                   |
| M  | `Component/Worker/DbUrl.php`                           |
| M  | `Component/Worker/NaverBookDbUrl.php`                  |
| M  | `Component/Worker/NaverDbUrl.php`                      |
| M  | `Component/Worker/NaverDbUrl3.php`                     |
| M  | `Controller/Admin/Board/ArticleViewController.php`     |
| M  | `Controller/Admin/Marketing/NaverConfigController.php` |
| M  | `Controller/Admin/Share/LayerNaverStatsController.php` |

***

### 상세 Diff

#### Admin/marketing/naver\_config.php

```diff
--- a/Admin/marketing/naver_config.php
+++ b/Admin/marketing/naver_config.php
@@ -8,9 +8,6 @@
             $('[name=naverReviewChannel][value=both]').prop('disabled',true);
         }
 
-        // 등급설정을 실행한다.
-        naverGradeChange(<?php echo $data['naverGrade'];?>);
-
         $(".js-layer-naver-stats").click(function(e){
             layer_add_info('naver_stats');
         });
@@ -28,13 +25,6 @@
         $(".js-naver-summary-url").hide();
         <?php } ?>
 
-        //등급변경 처리
-        $('#naverGrade').change(function(event) {
-            var value = $(this).val();
-
-            naverGradeChange(value);
-        });
-
         // 사용여부 라디오 버튼 이벤트 처리
         $('input[name="naverFl"]').on('change', function() {
             if ($(this).val() === 'y') {
@@ -50,23 +40,6 @@
         $('input[name="naverFl"]:checked').trigger('change');
     });
 
-    function naverGradeChange(value){
-        if (value == '1') {
-            gval='9,900';
-        } else if (value == '2'){
-            gval='9,900';
-        } else if (value == '3'){
-            gval='49,900';
-        } else if (value == '4'){
-            gval='99,000';
-        } else if (value == '5'){
-            gval='499,000';
-        } else {
-            gval='9,900';
-        }
-        $('#naverGradeCount').text(gval);
-    }
-
     document.addEventListener('DOMContentLoaded', () => {
         const modal = new GodoMarketing.MarketingGuideModalManager();
 
@@ -142,23 +115,22 @@
             </td>
         </tr>
         <tr class="dependent">
-            <th>네이버 쇼핑몰<br>몰등급 설정</th>
+            <th>EP 최대 상품수<br/>설정</th>
             <td>
                 <div class="form-inline">
                     <label>
                         <?= gd_select_box('naverGrade', 'naverGrade', $naverGrade, null, $data['naverGrade']); ?>
-                        <span class="notice-ref notice-sm">EP최대 상품수 : <span id="naverGradeCount"></span> 개</span>
                     </label>
                 </div>
                 <div class="notice-info">
-                    선택한 네이버 쇼핑몰 몰등급에 따라 EP 생성이 제한됩니다
+                    선택한 EP 최대 상품수에 따라 EP 생성이 제한됩니다.
                 </div>
-                <div class="notice-info">
-                    <span class="text-danger">몰등급 설정은 네이버 쇼핑파트너존의 쇼핑몰 몰등급과 동일</span>해야 합니다. 동일하지 않은 경우 <span class="text-danger">EP 수신에 실패</span>할 수 있습니다. . <a href="https://adCenter.shopping.naver.com" class="snote btn-link" target="_blank">네이버 쇼핑파트너존</a>
-
+                <div class="notice-info if-btn">
+                    EP 최대 상품수는 <span class="text-danger">전월 정산 수수료 또는 DB당 수수료</span>를 기준으로 결정됩니다.<br/>
+                    한도 초과 상태로 <span class="text-danger">EP 수신 오류가 3일 이상 지속</span>될 경우 네이버쇼핑 서비스 이용이 중단될 수 있습니다.
                 </div>
                 <div class="notice-info">
-                    변경된 쇼핑몰 몰등급은 변경 후 다음 EP생성 시 반영됩니다.
+                    변경된 EP 최대 상품수는 변경 후 다음 EP 생성 시 반영됩니다.
                 </div>
             </td>
         </tr>
```

#### Admin/share/layer\_naver\_stats.php

```diff
--- a/Admin/share/layer_naver_stats.php
+++ b/Admin/share/layer_naver_stats.php
@@ -26,11 +26,8 @@
             </tr>
 
         </table>
-        <p class="notice-info">
-            네이버 쇼핑몰 몰등급 설정 정보 | 쇼핑몰 몰등급  : <?php echo $naverGradeName?>,  최대 상품수 : <?php echo number_format($naverGradeMaxCount)?>개
-        </p>
         <p class="notice-danger">
-            네이버 쇼핑 노출 상품수는 네이버 쇼핑몰 몰등급에 따라 제한됩니다. 몰등급별 최대 상품수 초과 시, 최근등록일 순으로 노출 상품이 조정됩니다.
+            네이버쇼핑의 EP 최대 상품수는 전월 수수료 또는 DB당 수수료를 기준으로 결정되며, 상품수 초과 시, 최근등록일 순으로 노출 상품이 조정됩니다.
         </p>
     </div>
 </div>
```

#### Component/Board/ArticleListAdmin.php

```diff
--- a/Component/Board/ArticleListAdmin.php
+++ b/Component/Board/ArticleListAdmin.php
@@ -57,14 +57,17 @@ class ArticleListAdmin extends \Component\Board\ArticleAdmin
     public function getExcelList($getValue = null)
     {
         $where = '';
+        $arrBind = [];
 
         if (gd_isset($getValue['searchWord'])) {
             switch ($getValue['searchField']) {
                 case 'subject' :
-                    $arrWhere[] = "subject LIKE concat('%','".$getValue['searchWord']."','%')";
+                    $arrWhere[] = "subject LIKE concat('%',?,'%')";
+                    $this->db->bind_param_push($arrBind, 's', $getValue['searchWord']);
                     break;
                 case 'contents' :
-                    $arrWhere[] = "contents LIKE concat('%','".$getValue['searchWord']."','%')";
+                    $arrWhere[] = "contents LIKE concat('%',?,'%')";
+                    $this->db->bind_param_push($arrBind, 's', $getValue['searchWord']);
                     break;
                 case 'writerNm' :
 
@@ -74,10 +77,13 @@ class ArticleListAdmin extends \Component\Board\ArticleAdmin
                         $_searchField = 'writerNick';
                     }
 
-                    $arrWhere[] = $_searchField." LIKE concat('%','".$getValue['searchWord']."','%')";
+                    $arrWhere[] = $_searchField." LIKE concat('%',?,'%')";
+                    $this->db->bind_param_push($arrBind, 's', $getValue['searchWord']);
                     break;
                 case 'subject_contents' :
-                    $arrWhere[] = "(subject LIKE concat('%','".$getValue['searchWord']."','%') or contents LIKE concat('%','".$getValue['searchWord']."','%') )";
+                    $arrWhere[] = "(subject LIKE concat('%',?,'%') or contents LIKE concat('%',?,'%') )";
+                    $this->db->bind_param_push($arrBind, 's', $getValue['searchWord']);
+                    $this->db->bind_param_push($arrBind, 's', $getValue['searchWord']);
                     break;
             }
         }
@@ -88,15 +94,18 @@ class ArticleListAdmin extends \Component\Board\ArticleAdmin
             } else {
                 $dateField = 'bd.regDt';
             }
-            $arrWhere[] = $dateField . " between '".$getValue['rangDate'][0]."' and '".$getValue['rangDate'][1] . " 23:59'";
+            $arrWhere[] = $dateField . " between ? AND ?";
+            $this->db->bind_param_push($arrBind, 's', $getValue['rangDate'][0]);
+            $this->db->bind_param_push($arrBind, 's', $getValue['rangDate'][1] . ' 23:59');
         }
 
         if(gd_isset($getValue['sno'])) {
-            $arrWhere[] = ' bd.sno in (' . gd_implode(',', $getValue['sno']) . ')';
+            $arrWhere[] = ' bd.sno in (' . gd_implode(',', array_map('intval', (array)$getValue['sno'])) . ')';
         }
 
         if(gd_isset($getValue['category'])) {
-            $arrWhere[] = ' bd.category = \''.$getValue['category'].'\'';
+            $arrWhere[] = ' bd.category = ?';
+            $this->db->bind_param_push($arrBind, 's', $getValue['category']);
         }
 
         // 신고 게시글은 무조건 미노출
@@ -111,7 +120,7 @@ class ArticleListAdmin extends \Component\Board\ArticleAdmin
             $sql = "SELECT bd.*,mg.groupNm,m.groupSno FROM " . DB_BD_ . $this->cfg['bdId'] ." as bd LEFT OUTER JOIN ".DB_MEMBER." as m ON bd.memNo = m.memNo LEFT OUTER JOIN ".DB_MEMBER_GROUP." as mg ON m.groupSno = mg.sno ". $where;
         }
 
-        $getData['list'] = gd_htmlspecialchars_stripslashes($this->db->query_fetch($sql));
+        $getData['list'] = gd_htmlspecialchars_stripslashes($this->db->query_fetch($sql, $arrBind));
         foreach ($getData['list'] as &$data) {
             $this->getAttachments($data);
         }
```

#### Component/Board/Board.php

```diff
--- a/Component/Board/Board.php
+++ b/Component/Board/Board.php
@@ -1511,16 +1511,18 @@ abstract class Board
                     if (!empty($adminChk)) {
                         $mainBoardInfo = $this->selectParentBoard($arrData['groupNo'], $groupThread);
                         $arrData3 = [];
+                        $this->db->bind_param_push($arrData3, 's', $this->req['replyStatus']);
                         $this->db->bind_param_push($arrData3, 'i', $mainBoardInfo['sno']);
-                        $this->db->set_update_db(DB_BD_ . $this->cfg['bdId'], " replyStatus = '" . $this->req['replyStatus'] . "' ", 'sno = ?', $arrData3, false);
+                        $this->db->set_update_db(DB_BD_ . $this->cfg['bdId'], "replyStatus = ?", 'sno = ?', $arrData3, false);
                         unset($arrData3);
                     }
                 }
 
                 if ($this->cfg['bdReplyStatusFl'] == 'y') {
                     $arrData2 = [];
+                    $this->db->bind_param_push($arrData2, 's', $this->req['replyStatus']);
                     $this->db->bind_param_push($arrData2, 'i', $this->req['sno']);
-                    $this->db->set_update_db(DB_BD_ . $this->cfg['bdId'], " replyStatus = '" . $this->req['replyStatus'] . "' ", 'sno = ?', $arrData2, false);
+                    $this->db->set_update_db(DB_BD_ . $this->cfg['bdId'], "replyStatus = ?", 'sno = ?', $arrData2, false);
                 }
                 $replyData = $this->buildQuery->selectOne($replySno);
 
@@ -1573,8 +1575,9 @@ abstract class Board
                     if (!empty($adminChk)) {
                         $mainBoardInfo = $this->selectParentBoard($arrData['groupNo'], $groupThread);
                         $arrData3 = [];
+                        $this->db->bind_param_push($arrData3, 's', $this->req['replyStatus']);
                         $this->db->bind_param_push($arrData3, 'i', $mainBoardInfo['sno']);
-                        $this->db->set_update_db(DB_BD_ . $this->cfg['bdId'], " replyStatus = '" . $this->req['replyStatus'] . "' ", 'sno = ?', $arrData3, false);
+                        $this->db->set_update_db(DB_BD_ . $this->cfg['bdId'], "replyStatus = ?", 'sno = ?', $arrData3, false);
                         unset($arrData3);
                     }
                 }
@@ -1588,6 +1591,9 @@ abstract class Board
 
                 //게시글 이동
                 if ($this->req['isMove'] == 'y' && $this->req['moveBdId'] && $this->req['moveBdId'] != $this->cfg['bdId']) {
+                    if (empty(BoardUtil::getData($this->req['moveBdId']))) {
+                        throw new \Exception(sprintf(__('%s 게시판을 찾을 수 없습니다.'), $this->req['moveBdId']));
+                    }
                     $fields = [];
                     foreach (DBTableField::tableBd() as $key => $val) {
                         $fields[] = $val['val'];
```

#### Component/Board/BoardReport.php

```diff
--- a/Component/Board/BoardReport.php
+++ b/Component/Board/BoardReport.php
@@ -149,6 +149,9 @@ class BoardReport extends \Component\AbstractComponent
                 if ($req['bdId'] == 'plusReview') {
                     $tableName = DB_PLUS_REVIEW_ARTICLE;
                 } else {
+                    if (empty(BoardUtil::getData($req['bdId']))) {
+                        throw new \Exception(sprintf(__('%s 게시판을 찾을 수 없습니다.'), $req['bdId']));
+                    }
                     $tableName = 'es_bd_' . $req['bdId'];
                 }
                 $arrBind = null;
@@ -204,6 +207,9 @@ class BoardReport extends \Component\AbstractComponent
                 $result['sno'] = $getData['memoSno'];
                 $result['listType'] = 'memoSno';
             } else {
+                if (empty(BoardUtil::getData($getData['bdId']))) {
+                    throw new \Exception(sprintf(__('%s 게시판을 찾을 수 없습니다.'), $getData['bdId']));
+                }
                 $result['tableName'] = 'es_bd_' . $getData['bdId'];
                 $result['sno'] = $getData['bdSno'];
                 $result['listType'] = 'board';
```

#### Component/Goods/GoodsAdmin.php

```diff
--- a/Component/Goods/GoodsAdmin.php
+++ b/Component/Goods/GoodsAdmin.php
@@ -2553,7 +2553,7 @@ class GoodsAdmin extends \Component\Goods\Goods
                     foreach($arrData['optionYIcon']['goodsImage'][0] as $iconKey => $iconVal){
                         $arrBind['param'][] = 'optionValue = ?';
                         $this->db->bind_param_push($arrBind['bind'], 's', $optionUnique[$iconKey]);
-                        $strWhere = 'goodsImage="'.$iconVal.'" AND goodsNo="'.$arrData['goodsNo'].'"';
+                        $strWhere = 'goodsImage="'.$this->db->escape($iconVal).'" AND goodsNo="'.$this->db->escape($arrData['goodsNo']).'"';
                         $this->db->set_update_db(DB_GOODS_OPTION_ICON, $arrBind['param'], $strWhere, $arrBind['bind']);
                         unset($arrBind);
                     }
@@ -6171,12 +6171,12 @@ class GoodsAdmin extends \Component\Goods\Goods
 
             if (Session::get('manager.isProvider')) { // 전체 레코드 수
                 if($page->hasRecodeCache('amount') === false) {
-                    $page->recode['amount'] = $this->db->getCount($this->goodsTable, 'goodsNo', 'WHERE delFl=\'' . $getValue['delFl'] . '\'  AND scmNo = \'' . Session::get('manager.scmNo') . '\'');
+                    $page->recode['amount'] = $this->db->getCount($this->goodsTable, 'goodsNo', 'WHERE delFl=\'' . $this->db->escape($getValue['delFl']) . '\'  AND scmNo = \'' . Session::get('manager.scmNo') . '\'');
                 }
                 $scmWhereString = " AND g.scmNo = '" . (string)Session::get('manager.scmNo') . "'"; // 공급사인 경우
             }  else {
                 if($page->hasRecodeCache('amount') === false) {
-                    $page->recode['amount'] = $this->db->getCount($this->goodsTable, 'goodsNo', 'WHERE delFl=\'' . $getValue['delFl'] . '\'');
+                    $page->recode['amount'] = $this->db->getCount($this->goodsTable, 'goodsNo', 'WHERE delFl=\'' . $this->db->escape($getValue['delFl']) . '\'');
                 }
             }
 
@@ -6776,16 +6776,16 @@ class GoodsAdmin extends \Component\Goods\Goods
         if ($getData['sortAutoFl'] == 'y') { //자동 진열인 경우
 
             if ($getData['pageNow'] > 1) {
-                $strSQL = 'UPDATE ' . $dbTable . ' SET goodsSort = 0  where cateCd=\'' . $getData['cateCd'] . '\'';
+                $strSQL = 'UPDATE ' . $dbTable . ' SET goodsSort = 0  where cateCd=\'' . $this->db->escape($getData['cateCd']) . '\'';
                 $this->db->query($strSQL);
             } else {
-                $strSQL = 'UPDATE ' . $dbTable . ' SET goodsSort = 0 ,fixSort = 0  where cateCd=\'' . $getData['cateCd'] . '\'';
+                $strSQL = 'UPDATE ' . $dbTable . ' SET goodsSort = 0 ,fixSort = 0  where cateCd=\'' . $this->db->escape($getData['cateCd']) . '\'';
                 $this->db->query($strSQL);
             }
 
             if ($getData['sortFix']) {
                 foreach ($getData['sortFix'] as $key => $val) {
-                    $tmpField[] = 'WHEN \'' . $val . '\' THEN \'' . sprintf('%05s', $key+1) . '\'';
+                    $tmpField[] = 'WHEN \'' . $this->db->escape($val) . '\' THEN \'' . sprintf('%05s', $key+1) . '\'';
                 }
 
                 $strSetSQL = 'SET @newSort := 0;';
@@ -6794,7 +6794,7 @@ class GoodsAdmin extends \Component\Goods\Goods
                 $sortField = ' CASE goodsNo ' . gd_implode(' ', $tmpField) . ' ELSE \'\' END ';
 
                 $strSQL = 'UPDATE '.$dbTable.' SET fixSort = ( @newSort := @newSort+1 )
-                            WHERE  cateCd="'.$getData['cateCd'].'"  AND (goodsNo = \'' . gd_implode('\' OR goodsNo = \'', $getData['sortFix']) . '\') ' . $addWhere . ' ORDER BY (' . $sortField . ') DESC';
+                            WHERE  cateCd="'.$this->db->escape($getData['cateCd']).'"  AND (goodsNo = \'' . gd_implode('\' OR goodsNo = \'', array_map([$this->db, 'escape'], $getData['sortFix'])) . '\') ' . $addWhere . ' ORDER BY (' . $sortField . ') DESC';
                 $this->db->query($strSQL);
 
             }
@@ -6813,7 +6813,7 @@ class GoodsAdmin extends \Component\Goods\Goods
                                   FROM '.$this->goodsTable.'
                                   WHERE delFl = "n" AND applyFl = "y"
 
-                                ) AND cateCd="'.$getData['cateCd'].'" ' . $addWhere . ' ORDER BY goodsSort ASC';
+                                ) AND cateCd="'.$this->db->escape($getData['cateCd']).'" ' . $addWhere . ' ORDER BY goodsSort ASC';
 
             $this->db->query($strSQL);
 
@@ -6832,7 +6832,7 @@ class GoodsAdmin extends \Component\Goods\Goods
                                   SELECT goodsNo
                                   FROM '.$this->goodsTable.'
                                   WHERE delFl = "n" AND applyFl = "y"
-                                ) AND cateCd="'.$getData['cateCd'].'" ORDER BY goodsSort ASC';
+                                ) AND cateCd="'.$this->db->escape($getData['cateCd']).'" ORDER BY goodsSort ASC';
 
             $this->db->query($strSQL);
 
@@ -6843,7 +6843,7 @@ class GoodsAdmin extends \Component\Goods\Goods
             $fixCount = gd_count($getData['sortFix']);
             foreach($getData['goodsSort'] as  $k => $v) {
 
-                $strWhere = "goodsNo = '".$getData['goodsNo'][$k]."' AND cateCd='".$getData['cateCd']."'";
+                $strWhere = "goodsNo = '".$this->db->escape($getData['goodsNo'][$k])."' AND cateCd='".$this->db->escape($getData['cateCd'])."'";
 
                 if(is_array($getData['sortFix']) && gd_in_array($getData['goodsNo'][$k],$getData['sortFix'])) {
                     $fixSort = $fixCount;
@@ -6867,7 +6867,7 @@ class GoodsAdmin extends \Component\Goods\Goods
             if($prevSort) {
                 $sortCnt = 0;
                 foreach($prevSort as $k => $v) {
-                    $strWhere = "goodsNo NOT IN ('" . gd_implode("','", $prevSort) . "') AND cateCd='".$getData['cateCd']."' AND goodsSort <= ".($totalGoodsSort-$k)." AND goodsSort >= ".($totalGoodsSort-$sortCnt-$getData['pagePnum']);
+                    $strWhere = "goodsNo NOT IN ('" . gd_implode("','", array_map([$this->db, 'escape'], $prevSort)) . "') AND cateCd='".$this->db->escape($getData['cateCd'])."' AND goodsSort <= ".($totalGoodsSort-$k)." AND goodsSort >= ".($totalGoodsSort-$sortCnt-$getData['pagePnum']);
                     $this->db->set_update_db($dbTable, array("goodsSort = goodsSort-1 "), $strWhere);
                     $sortCnt++;
                 }
@@ -6876,7 +6876,7 @@ class GoodsAdmin extends \Component\Goods\Goods
             if($nextSort) {
                 $sortCnt = 0;
                 foreach($nextSort as $k => $v) {
-                    $strWhere = "goodsNo NOT IN ('" . gd_implode("','", $nextSort) . "') AND cateCd='".$getData['cateCd']."' AND goodsSort < ".($totalGoodsSort-($getData['pagePnum']-$sortCnt))." AND goodsSort >= ".($totalGoodsSort-$k);
+                    $strWhere = "goodsNo NOT IN ('" . gd_implode("','", array_map([$this->db, 'escape'], $nextSort)) . "') AND cateCd='".$this->db->escape($getData['cateCd'])."' AND goodsSort < ".($totalGoodsSort-($getData['pagePnum']-$sortCnt))." AND goodsSort >= ".($totalGoodsSort-$k);
                     $this->db->set_update_db($dbTable, array("goodsSort = goodsSort+1 "), $strWhere);
                     $sortCnt++;
                 }
@@ -6884,7 +6884,7 @@ class GoodsAdmin extends \Component\Goods\Goods
         }
 
         if ($getData['pageNow'] > 1 && $getData['sortFix']) {
-            $strSQL = "UPDATE " . $dbTable . " SET fixSort = fixSort+".gd_count($getData['sortFix'])."  where cateCd='" . $getData['cateCd'] . "' AND fixSort > 0 AND goodsNo NOT IN ('" . gd_implode("','", $getData['sortFix']) . "') ";
+            $strSQL = "UPDATE " . $dbTable . " SET fixSort = fixSort+".gd_count($getData['sortFix'])."  where cateCd='" . $this->db->escape($getData['cateCd']) . "' AND fixSort > 0 AND goodsNo NOT IN ('" . gd_implode("','", array_map([$this->db, 'escape'], $getData['sortFix'])) . "') ";
             $this->db->query($strSQL);
         }
     }
@@ -7124,9 +7124,9 @@ class GoodsAdmin extends \Component\Goods\Goods
 
         if($page->hasRecodeCache('amount') === false) {
             if (Session::get('manager.isProvider') || $mode === 'delivery') { // 전체 레코드 수
-                $page->recode['amount'] = $this->db->getCount($this->goodsTable, 'goodsNo', 'WHERE applyFl !="a" AND delFl=\'' . $getValue['delFl'] . '\'  AND scmNo = \'' . Session::get('manager.scmNo') . '\'');
+                $page->recode['amount'] = $this->db->getCount($this->goodsTable, 'goodsNo', 'WHERE applyFl !="a" AND delFl=\'' . $this->db->escape($getValue['delFl']) . '\'  AND scmNo = \'' . Session::get('manager.scmNo') . '\'');
             } else {
-                $page->recode['amount'] = $this->db->getCount($this->goodsTable, 'goodsNo', 'WHERE applyFl !="a" AND  delFl=\'' . $getValue['delFl'] . '\'');
+                $page->recode['amount'] = $this->db->getCount($this->goodsTable, 'goodsNo', 'WHERE applyFl !="a" AND  delFl=\'' . $this->db->escape($getValue['delFl']) . '\'');
             }
         }
 
@@ -10635,7 +10635,7 @@ class GoodsAdmin extends \Component\Goods\Goods
         $strField[] = "g.goodsNo AS ori_goodsNo, g.goodsNm AS ori_goodsNm, g.optionName AS ori_optionName, g.totalStock, g.goodsDisplayFl, g.goodsDisplayMobileFl, g.goodsSellFl, g.goodsSellMobileFl, g.soldOutFl, g.stockFl, g.delFl";
         $strField[] = "go.optionValue1, go.optionValue2, go.optionValue3, go.optionValue4, go.optionValue5, go.stockCnt";
 
-        $query = " WHERE gr.diffKey = '".$getValue['diffKey']."' LIMIT 1";
+        $query = " WHERE gr.diffKey = '".$this->db->escape($getValue['diffKey'])."' LIMIT 1";
         $strSQL = "
             SELECT ".gd_implode(", ", $strField)." FROM
                 ".DB_GOODS_RESTOCK." AS gr
@@ -10718,7 +10718,7 @@ class GoodsAdmin extends \Component\Goods\Goods
 
         if(trim($getValue['diffKey']) !== ''){
             $page->recode['total'] = $dataCount[0]['totalCnt']; //검색 레코드 수
-            $totalAmountSQL =  "SELECT COUNT(sno) AS totalCnt FROM " . DB_GOODS_RESTOCK . " WHERE diffKey = '".$getValue['diffKey']."'";
+            $totalAmountSQL =  "SELECT COUNT(sno) AS totalCnt FROM " . DB_GOODS_RESTOCK . " WHERE diffKey = '".$this->db->escape($getValue['diffKey'])."'";
             $totalAmount = $this->db->query_fetch($totalAmountSQL);
             $page->recode['amount'] = $totalAmount[0]['totalCnt'];
             $page->setPage();
@@ -10990,7 +10990,7 @@ class GoodsAdmin extends \Component\Goods\Goods
     {
         if(gd_count($postData['diffKey']) > 0){
             foreach($postData['diffKey'] as $key => $value){
-                $this->db->set_delete_db(DB_GOODS_RESTOCK, "diffKey = '".$value."'");
+                $this->db->set_delete_db(DB_GOODS_RESTOCK, "diffKey = '".$this->db->escape($value)."'");
             }
         }
     }
```

#### Component/Marketing/DBUrl.php

```diff
--- a/Component/Marketing/DBUrl.php
+++ b/Component/Marketing/DBUrl.php
@@ -94,7 +94,14 @@ class DBUrl
 
                 gd_isset($req['naverEventCommon'], 'n');
                 gd_isset($req['naverEventGoods'], 'n');
-                gd_isset($req['naverGrade'], 'n');
+
+                // naverGrade 화이트리스트 검증
+                // 신정책 키 '1'/'2'/'3' 외 값(빈 값 / 레거시 '4'/'5' / 잘못된 값) → '1' (10K, 가장 보수적) fallback
+                gd_isset($req['naverGrade'], '1');
+                if (!in_array($req['naverGrade'], ['1', '2', '3'], true)) {
+                    $req['naverGrade'] = '1';
+                }
+
                 gd_isset($req['onlyMemberReviewUsed'], 'n');
             }
 
```

#### Component/Marketing/DefineMarketing.php

```diff
--- a/Component/Marketing/DefineMarketing.php
+++ b/Component/Marketing/DefineMarketing.php
@@ -18,31 +18,25 @@ class DefineMarketing
 
     public function __construct()
     {
-        //회원등급
+        // 네이버쇼핑 EP 최대 상품수 (2026-06-02 시행 — 판매자 등급 폐지 → 수수료 기반 3단계 통합)
         $this->naverGrade = [
-            '1' => __('씨앗'),
-            '2' => __('새싹'),
-            '3' => __('파워'),
-            '4' => __('빅파워'),
-            '5' => __('프리미엄'),
+            '1' => __('10,000개'),
+            '2' => __('50,000개'),
+            '3' => __('100,000개'),
         ];
 
-        //등급에 따른 생성 상품최대수
+        // 등급에 따른 생성 상품 최대수
         $this->naverGradeMaxCount = [
             '1' => __('10000'),
-            '2' => __('10000'),
-            '3' => __('50000'),
-            '4' => __('100000'),
-            '5' => __('500000'),
+            '2' => __('50000'),
+            '3' => __('100000'),
         ];
 
-        //생성 상품 안전 수
+        // 생성 상품 안전 수 (네이버 측 cut-off 회피용 자체 여백)
         $this->naverGradeSafetyCount = [
             '1' => __('100'),
             '2' => __('100'),
-            '3' => __('100'),
-            '4' => __('1000'),
-            '5' => __('1000'),
+            '3' => __('1000'),
         ];
 
     }
```

#### Component/Memo/MemoAdmin.php

```diff
--- a/Component/Memo/MemoAdmin.php
+++ b/Component/Memo/MemoAdmin.php
@@ -33,16 +33,19 @@ class MemoAdmin extends \Component\Board\ArticleAdmin
     public function getExcelList($getValue = null)
     {
         $where = '';
+        $arrBind = [];
         $arrWhere[] = "bm.bdId='" . $this->cfg['bdId']."'";
 
         if (gd_isset($getValue['searchWord'])) {
             switch ($getValue['searchField']) {
                 case 'subject' :
-                    $arrWhere[] = "bd.subject LIKE concat('%','".$getValue['searchWord']."','%')";
+                    $arrWhere[] = "bd.subject LIKE concat('%',?,'%')";
+                    $this->db->bind_param_push($arrBind, 's', $getValue['searchWord']);
                     break;
                     break;
                 case 'contents' :
-                    $arrWhere[] = "bd.contents LIKE concat('%','".$getValue['searchWord']."','%')";
+                    $arrWhere[] = "bd.contents LIKE concat('%',?,'%')";
+                    $this->db->bind_param_push($arrBind, 's', $getValue['searchWord']);
                     break;
                 case 'writerNm' :
 
@@ -52,10 +55,13 @@ class MemoAdmin extends \Component\Board\ArticleAdmin
                         $_searchField = 'bd.writerNick';
                     }
 
-                    $arrWhere[] = $_searchField." LIKE concat('%','".$getValue['searchWord']."','%')";
+                    $arrWhere[] = $_searchField." LIKE concat('%',?,'%')";
+                    $this->db->bind_param_push($arrBind, 's', $getValue['searchWord']);
                     break;
                 case 'subject_contents' :
-                    $arrWhere[] = "(bd.subject LIKE concat('%','".$getValue['searchWord']."','%') or bd.contents LIKE concat('%','".$getValue['searchWord']."','%') )";
+                    $arrWhere[] = "(bd.subject LIKE concat('%',?,'%') or bd.contents LIKE concat('%',?,'%') )";
+                    $this->db->bind_param_push($arrBind, 's', $getValue['searchWord']);
+                    $this->db->bind_param_push($arrBind, 's', $getValue['searchWord']);
                     break;
             }
         }
@@ -66,19 +72,22 @@ class MemoAdmin extends \Component\Board\ArticleAdmin
             } else {
                 $dateField = 'bd.regDt';
             }
-            $arrWhere[] = $dateField . " between '".$getValue['rangDate'][0]."' and '".$getValue['rangDate'][1] . " 23:59'";
+            $arrWhere[] = $dateField . " between ? AND ?";
+            $this->db->bind_param_push($arrBind, 's', $getValue['rangDate'][0]);
+            $this->db->bind_param_push($arrBind, 's', $getValue['rangDate'][1] . ' 23:59');
         }
 
         if(gd_isset($getValue['sno'])) {
-            $arrWhere[] = ' bd.sno in (' . gd_implode(',', $getValue['sno']) . ')';
+            $arrWhere[] = ' bd.sno in (' . gd_implode(',', array_map('intval', (array)$getValue['sno'])) . ')';
         }
 
         if(gd_isset($getValue['category'])) {
-            $arrWhere[] = ' bd.category = \''.$getValue['category'].'\'';
+            $arrWhere[] = ' bd.category = ?';
+            $this->db->bind_param_push($arrBind, 's', $getValue['category']);
         }
 
         if(gd_isset($getValue['goodsPt'])) {
-            $arrWhere[] = ' bd.goodsPt = '.$getValue['goodsPt'];
+            $arrWhere[] = ' bd.goodsPt = ' . intval($getValue['goodsPt']);
         }
 
         // 신고 댓글은 무조건 미노출
@@ -92,7 +101,7 @@ class MemoAdmin extends \Component\Board\ArticleAdmin
             $query = "SELECT bm.*,m.groupSno,mg.groupNm FROM " . DB_BOARD_MEMO ." as bm LEFT JOIN es_bd_".$this->cfg['bdId']." as bd ON bd.sno = bm.bdSno LEFT OUTER JOIN ".DB_MEMBER." as m ON bm.memNo = m.memNo LEFT OUTER JOIN ".DB_MEMBER_GROUP." as mg ON m.groupSno = mg.sno";
         }
 
-        $getData['list'] = gd_htmlspecialchars_stripslashes($this->db->query_fetch($query. $where));
+        $getData['list'] = gd_htmlspecialchars_stripslashes($this->db->query_fetch($query. $where, $arrBind));
         $getData['columns'] = gd_htmlspecialchars_stripslashes($this->db->query_fetch("DESC " . DB_BD_ . $this->cfg['bdId']));
 
         return $getData['list'];
```

#### Component/Order/ExternalOrder.php

```diff
--- a/Component/Order/ExternalOrder.php
+++ b/Component/Order/ExternalOrder.php
@@ -687,7 +687,7 @@ class ExternalOrder extends \Component\Order\Order
 
             // 자체상품코드 체크
             if(Validator::required($getData['goodsCd']) === true){
-                $count = $this->db->getCount(DB_GOODS, 1, "WHERE goodsCd = '".$getData['goodsCd']."'");
+                $count = $this->db->getCount(DB_GOODS, 1, "WHERE goodsCd = '".$this->db->escape($getData['goodsCd'])."'");
                 if((int)$count < 1){
                     throw new Exception('존재하지 않는 ' . $this->sheetsNameArr['goodsCd'] . '입니다.');
                 }
@@ -698,7 +698,7 @@ class ExternalOrder extends \Component\Order\Order
 
             // 자체옵션코드 체크
             if(Validator::required($getData['optionCode']) === true && $getData['optionCode'] !== '옵션없음'){
-                $count = $this->db->getCount(DB_GOODS_OPTION, 1, "WHERE optionCode = '".$getData['optionCode']."'");
+                $count = $this->db->getCount(DB_GOODS_OPTION, 1, "WHERE optionCode = '".$this->db->escape($getData['optionCode'])."'");
                 if((int)$count < 1){
                     throw new Exception('존재하지 않는 ' . $this->sheetsNameArr['optionCode'] . '입니다.');
                 }
```

#### Component/Worker/AbstractDbUrl.php

```diff
--- a/Component/Worker/AbstractDbUrl.php
+++ b/Component/Worker/AbstractDbUrl.php
@@ -870,6 +870,12 @@ abstract class AbstractDbUrl
         $gradeMaxCount = $_defineMarketing->getNaverGradeMaxCount();
         $gradeSafetyCount = $_defineMarketing->getNaverGradeSafetyCount();
 
+        // 신정책 키 1/2/3 외 값(미재저장 레거시 4/5 또는 튜닝/격리 자체 키 등)은
+        // 가장 보수적인 한도(1, 10,000개)로 fallback — undefined index 방어
+        if (!isset($gradeMaxCount[$naverGrade])) {
+            $naverGrade = 1;
+        }
+
         $naverMaxCount = $gradeMaxCount[$naverGrade] - $gradeSafetyCount[$naverGrade];
 
         return $naverMaxCount;
```

#### Component/Worker/DbUrl.php

```diff
--- a/Component/Worker/DbUrl.php
+++ b/Component/Worker/DbUrl.php
@@ -363,6 +363,12 @@ class DbUrl
             }
             if ($params['site'] == 'targetingGates') {
                 $this->dburl_max_count = "200000";
+            } elseif (in_array($params['site'], ['naver', 'naverBook'], true)) {
+                // 네이버 EP 신정책 (2026-06-02 시행) — DefineMarketing.naverGradeMaxCount SSOT 활용.
+                // 최상 등급 한도를 site 절대 상한으로 (NaverDbUrl::setNaverGradeCount 가 등급별 cut-off 처리).
+                // intval cast — string max 함정 회피 ('50000' > '100000' lex 비교 잘못된 결과 방지).
+                $defineMarketing = \App::load('Component\\Marketing\\DefineMarketing');
+                $this->dburl_max_count = (string)max(array_map('intval', $defineMarketing->getNaverGradeMaxCount()));
             } else {
                 $this->dburl_max_count = "500000";
             }
@@ -375,7 +381,12 @@ class DbUrl
                 if($this->totalDburlData < $this->dburl_max_count) {
                     $this->db->strField = $arrField . ", GROUP_CONCAT( gi.imageNo SEPARATOR '^|^') AS imageNo, GROUP_CONCAT( gi.imageKind SEPARATOR '^|^') AS imageKind, IF(gi.goodsImageStorage = 'obs', GROUP_CONCAT( gi.imageUrl SEPARATOR '^|^'), GROUP_CONCAT( gi.imageName SEPARATOR '^|^')) AS imageName";
                     $this->db->strWhere = gd_implode(' AND ', $where)." AND g.goodsNo between ".($i-10000)." AND ".$i;
-                    $this->db->strOrder = 'g.goodsNo DESC';
+                    if (in_array($params['site'], ['naver', 'naverBook'], true)) {
+                        // 네이버 EP 신정책 정렬: 등록일 DESC → 동일 등록일 시 goodsNo DESC
+                        $this->db->strOrder = 'g.regDt DESC, g.goodsNo DESC';
+                    } else {
+                        $this->db->strOrder = 'g.goodsNo DESC';
+                    }
                     $this->db->strGroup = "g.goodsNo";
 
 
```

#### Component/Worker/NaverBookDbUrl.php

```diff
--- a/Component/Worker/NaverBookDbUrl.php
+++ b/Component/Worker/NaverBookDbUrl.php
@@ -99,7 +99,8 @@ class NaverBookDbUrl extends \Component\Worker\NaverDbUrl
         }
         $db->strWhere = gd_implode(' AND ', $this->goodsWheres) . " AND g.goodsNo between " . $startGoodsNo . " AND " . $goodsNo;
         //        $db->strWhere = implode(' AND ', $this->goodsWheres);
-        $db->strOrder = 'g.goodsNo DESC';
+        // 네이버 EP 신정책 정렬: 등록일 DESC → 동일 등록일 시 goodsNo DESC
+        $db->strOrder = 'g.regDt DESC, g.goodsNo DESC';
         $db->strGroup = "g.goodsNo";
 
         $db->strJoin = 'INNER JOIN es_goodsImage gi on gi.goodsNo = g.goodsNo AND  gi.imageKind IN ("magnify", "detail") AND gi.imageNo < 10' .$addJoin;
```

#### Component/Worker/NaverDbUrl.php

```diff
--- a/Component/Worker/NaverDbUrl.php
+++ b/Component/Worker/NaverDbUrl.php
@@ -43,6 +43,27 @@ class NaverDbUrl extends \Component\Worker\AbstractDbUrl
         $this->config = $componentDbUrl->getConfig('naver', 'config');
     }
 
+    /**
+     * 초기화 — v2 워커도 등급별 한도 cut-off 적용
+     */
+    protected function init()
+    {
+        parent::init();
+        $this->setNaverGradeCount();
+    }
+
+    /**
+     * 등급에 맞는 네이버 EP 생성 상품 최대수를 설정한다.
+     */
+    protected function setNaverGradeCount()
+    {
+        // 등급설정값이 없다면 가장 보수적인 한도(1, 10,000개)로 fallback
+        $naverGrade = empty($this->config['naverGrade']) ? '1' : $this->config['naverGrade'];
+
+        $naverMaxLimit = $this->gatGradeMaxLimit($naverGrade);
+        $this->setMaxCount($naverMaxLimit);
+    }
+
     /**
      * EP 3.0 사용 여부
      *
@@ -71,6 +92,43 @@ class NaverDbUrl extends \Component\Worker\AbstractDbUrl
         return $this->config['naverFl'] != 'y';
     }
 
+    /**
+     * 상품 조회 — 네이버 EP 신정책 정렬 적용
+     *
+     * 부모 AbstractDbUrl::selectGoodsGenerator 의 strOrder 만 신정렬로 오버라이드한다.
+     * 부모 변경 시 다른 EP 워커(Daum/Mobon/TargetingGates 등) 영향이 있어
+     * v2 워커 자체에 override 형태로 적용.
+     *
+     * 기획서 §5-2: 한도 초과 시 노출 우선순위
+     *   - 상품등록일 DESC
+     *   - 동일 등록일 시 goodsNo DESC (tie-breaker)
+     *
+     * @param int      $goodsNo
+     * @param int|null $sgoodsNo
+     *
+     * @return \Generator
+     */
+    protected function selectGoodsGenerator(int $goodsNo, int $sgoodsNo = null): \Generator
+    {
+        if (($goodsNo - $this->limit) < $sgoodsNo) {
+            $startGoodsNo = $sgoodsNo;
+        } else {
+            $startGoodsNo = $goodsNo - $this->limit;
+        }
+
+        $db = \App::getInstance('DB');
+        $db->strField = $this->getFieldsGoods() . ", GROUP_CONCAT( gi.imageNo SEPARATOR '^|^') AS imageNo, GROUP_CONCAT( gi.imageKind SEPARATOR '^|^') AS imageKind, IF(gi.goodsImageStorage = 'obs', GROUP_CONCAT( gi.imageUrl SEPARATOR '^|^'), GROUP_CONCAT( gi.imageName SEPARATOR '^|^')) AS imageName";
+        $db->strWhere = gd_implode(' AND ', $this->goodsWheres) . " AND g.goodsNo between " . $startGoodsNo . " AND " . $goodsNo;
+        // 네이버 EP 신정책 정렬: 등록일 DESC → 동일 등록일 시 goodsNo DESC
+        $db->strOrder = 'g.regDt DESC, g.goodsNo DESC';
+        $db->strGroup = "g.goodsNo";
+        $db->strJoin = 'INNER JOIN es_goodsImage gi on gi.goodsNo = g.goodsNo AND  gi.imageKind IN ("magnify", "detail") AND gi.imageNo = 0';
+        $this->goodsQuery = $db->query_complete();
+        $strSQL = 'SELECT ' . array_shift($this->goodsQuery) . ' FROM ' . DB_GOODS . ' as g' . gd_implode(' ', $this->goodsQuery);
+
+        return $db->query_fetch_generator($strSQL);
+    }
+
     /**
      * 상품 시작과 종료 번호를 조회
      *
```

#### Component/Worker/NaverDbUrl3.php

```diff
--- a/Component/Worker/NaverDbUrl3.php
+++ b/Component/Worker/NaverDbUrl3.php
@@ -122,7 +122,8 @@ class NaverDbUrl3 extends \Component\Worker\NaverDbUrl
         $db->strField .= ' ,gup.unitPriceFl, gup.unitQuantity, gup.unitType, gup.unitBaseQuantity';
         $db->strWhere = gd_implode(' AND ', $this->goodsWheres) . " AND g.goodsNo between " . $startGoodsNo . " AND " . $goodsNo;
         //        $db->strWhere = implode(' AND ', $this->goodsWheres);
-        $db->strOrder = 'g.goodsNo DESC';
+        // 네이버 EP 신정책 정렬: 등록일 DESC → 동일 등록일 시 goodsNo DESC
+        $db->strOrder = 'g.regDt DESC, g.goodsNo DESC';
         $db->strGroup = "g.goodsNo";
 
         $db->strJoin = 'INNER JOIN es_goodsImage gi on gi.goodsNo = g.goodsNo AND  gi.imageKind IN ("magnify", "detail") AND gi.imageNo < 10' .$addJoin;
```

#### Controller/Admin/Board/ArticleViewController.php

```diff
--- a/Controller/Admin/Board/ArticleViewController.php
+++ b/Controller/Admin/Board/ArticleViewController.php
@@ -80,7 +80,7 @@ class ArticleViewController extends \Controller\Admin\Controller
             $bdView['data'] = gd_isset($getData);
             $bdView['member'] = gd_isset($boardView->member);
             $this->setData('writer', $articleWrite->getWrite());
-            $this->setData('req', gd_isset($req));
+            $this->setData('req', gd_htmlspecialchars_addslashes($req));
             $this->setData('bdView', $bdView);
             if($req['listType'] == 'memo') {
                 return true;
```

#### Controller/Admin/Marketing/NaverConfigController.php

```diff
--- a/Controller/Admin/Marketing/NaverConfigController.php
+++ b/Controller/Admin/Marketing/NaverConfigController.php
@@ -93,7 +93,6 @@ class NaverConfigController extends \Controller\Admin\Controller
 		$this->setData('data',gd_isset($data));
 		$this->setData('checked',gd_isset($checked));
         $this->setData('naverGrade',$this->_defineMarketing->getNaverGrade());
-        $this->setData('naverGradeCount',$this->_defineMarketing->getNaverGradeMaxCount());
 		$this->setData('joinGroup',gd_isset($joinGroup));
 		$this->setData('godo',(Globals::get('gLicense')));
 		$this->setData('useFlPlusReview',$plusReviewConfig->getConfig('useFl'));
```

#### Controller/Admin/Share/LayerNaverStatsController.php

```diff
--- a/Controller/Admin/Share/LayerNaverStatsController.php
+++ b/Controller/Admin/Share/LayerNaverStatsController.php
@@ -67,12 +67,11 @@ class LayerNaverStatsController extends \Controller\Admin\Controller
                 $this->setData('goodsNaverStats', $goodsNaverStats);
             }
 
-            //네이버 등급 정보
-            $naverGradeName = $_defineMarketing->getNaverGrade();
+            // 네이버 EP 최대 상품수 정보 (2026-06-02 정책 변경 — 등급명 미사용)
             $naverMaxCount = $_defineMarketing->getNaverGradeMaxCount();
             $naverSafetyCount = $_defineMarketing->getNaverGradeSafetyCount();
 
-            //설정이 없는 경우 초기값 부여
+            // 설정이 없는 경우 초기값 부여
             if (empty($navsrConfigData['naverGrade']) === true) {
                 $navsrConfigData['naverGrade'] = '1';
             }
@@ -90,7 +89,6 @@ class LayerNaverStatsController extends \Controller\Admin\Controller
             $this->setData('callFunc', gd_isset($getValue['callFunc'],''));
             $this->setData('childRow',gd_isset($getValue['childRow']));
             $this->setData('statsData',gd_isset($statsData));
-            $this->setData('naverGradeName',$naverGradeName[$navsrConfigData['naverGrade']]);
             $this->setData('naverGradeMaxCount',$naverMaxCount[$navsrConfigData['naverGrade']]-$naverSafetyCount[$navsrConfigData['naverGrade']]);
 
             $this->setData('cate', $cate);
```
