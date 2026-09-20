/* global frappe */
frappe.pages["arabic-pro-accounting-guide"].on_page_load = function (wrapper) {
	const page = frappe.ui.make_app_page({
		parent: wrapper,
		title: "دليل الدورة المحاسبية",
		single_column: true,
	});

	page.main.html(`
		<main class="ap-cycle" dir="rtl" lang="ar">
			<header class="ap-cycle-hero">
				<div class="ap-cycle-hero-copy">
					<p class="ap-cycle-eyebrow">Arabic Pro · دليل عملي للمحاسب</p>
					<h1>من القيد إلى القوائم المالية</h1>
					<p>ابدأ بحركة واحدة، ثم اتبع أثرها في دفتر الأستاذ وميزان المراجعة وقائمة الدخل والميزانية العمومية. في النهاية تعرّف متى وكيف تُقفل الفترة.</p>
				</div>
				<div class="ap-cycle-hero-example" aria-label="مثال القيد المستخدم في الدليل">
					<span>مثالنا في كل خطوة</span>
					<strong>صيانة المكتب · ٥٠٠ ريال</strong>
					<small>دفعت الشركة المبلغ من حسابها البنكي.</small>
				</div>
			</header>

			<ol class="ap-cycle-flow" aria-label="تسلسل الدورة المحاسبية">
				<li><button type="button" data-ap-cycle-target="ap-cycle-setup"><b>٠</b><span>تهيئة الحسابات</span></button></li>
				<li><button type="button" data-ap-cycle-target="ap-cycle-entry"><b>١</b><span>قيد أو مستند</span></button></li>
				<li><button type="button" data-ap-cycle-target="ap-cycle-ledger"><b>٢</b><span>دفتر الأستاذ</span></button></li>
				<li><button type="button" data-ap-cycle-target="ap-cycle-trial"><b>٣</b><span>ميزان المراجعة</span></button></li>
				<li><button type="button" data-ap-cycle-target="ap-cycle-reconcile"><b>٤</b><span>المطابقات والتسويات</span></button></li>
				<li><button type="button" data-ap-cycle-target="ap-cycle-statements"><b>٥</b><span>القوائم المالية</span></button></li>
				<li><button type="button" data-ap-cycle-target="ap-cycle-close"><b>٦</b><span>إقفال الفترة</span></button></li>
			</ol>

			<div class="ap-cycle-layout">
				<nav class="ap-cycle-sidebar" aria-label="أقسام الدليل">
					<span>في هذا الدليل</span>
					<button type="button" data-ap-cycle-target="ap-cycle-setup">قبل أول قيد</button>
					<button type="button" data-ap-cycle-target="ap-cycle-entry">إدخال القيد واعتماده</button>
					<button type="button" data-ap-cycle-target="ap-cycle-ledger">قراءة دفتر الأستاذ</button>
					<button type="button" data-ap-cycle-target="ap-cycle-trial">فحص ميزان المراجعة</button>
					<button type="button" data-ap-cycle-target="ap-cycle-reconcile">المطابقات والتسويات</button>
					<button type="button" data-ap-cycle-target="ap-cycle-checkup">اختبر جاهزية الفترة</button>
					<button type="button" data-ap-cycle-target="ap-cycle-statements">إعداد القوائم وفهمها</button>
					<button type="button" data-ap-cycle-target="ap-cycle-close">إقفال السنة والترحيل</button>
					<button type="button" data-ap-cycle-target="ap-cycle-questions">أسئلة مهمة</button>
				</nav>

				<div class="ap-cycle-article">
					<section id="ap-cycle-setup" class="ap-cycle-section">
						<div class="ap-cycle-section-head"><span>٠</span><div><p>خطوة تسبق التسجيل</p><h2>اضبط أساس التقارير أولًا</h2></div></div>
						<p>قبل إدخال الحركة، تأكد من اختيار <strong>الشركة</strong> ووجود <strong>سنة مالية</strong> تشمل تاريخ الترحيل. راجع دليل الحسابات: لكل حساب أب صحيح ونوع جذر مناسب. حسابات الأصول والالتزامات وحقوق الملكية تظهر في الميزانية، وحسابات الإيرادات والمصروفات تظهر في قائمة الدخل.</p>
						<p>جهّز حساب البنك ومراكز التكلفة والضرائب والحسابات الافتراضية للشركة حسب عملك. الحساب «المجموعة» ينظم الدليل؛ الحركة تُسجل على حساب نهائي غير مجموعة.</p>
						<div class="ap-cycle-actions"><a href="/app/account/view/List">افتح دليل الحسابات</a><a href="/app/fiscal-year/view/List">راجع السنة المالية</a></div>
					</section>

					<section id="ap-cycle-entry" class="ap-cycle-section">
						<div class="ap-cycle-section-head"><span>١</span><div><p>بداية الأثر المحاسبي</p><h2>سجّل قيدًا متوازنًا ثم اعتمده</h2></div></div>
						<p>إذا كانت العملية بيعًا أو شراءً أو دفعًا عاديًا، ابدأ بالفاتورة أو قيد الدفع المخصص. استخدم <strong>قيد اليومية</strong> للتسويات والاستحقاقات والتحويلات التي تحتاج معالجة مباشرة.</p>
						<ol class="ap-cycle-steps"><li>اختر الشركة ونوع القيد وتاريخ الترحيل.</li><li>أضف سطرًا لكل حساب، وحدد مركز التكلفة أو الطرف والمرجع عند الحاجة.</li><li>راجع أن <strong>إجمالي المدين يساوي إجمالي الدائن</strong>، ثم اكتب وصفًا مفهومًا وأرفق المستند المؤيد.</li><li>احفظ للمراجعة، وبعد اعتماد المسؤول اضغط «اعتماد».</li></ol>
						<div class="ap-cycle-ledger-example"><p>مثال تعليمي: صيانة المكتب من البنك</p><table><thead><tr><th>الحساب</th><th>مدين</th><th>دائن</th></tr></thead><tbody><tr><td>مصروف الصيانة</td><td>٥٠٠</td><td>—</td></tr><tr><td>البنك</td><td>—</td><td>٥٠٠</td></tr></tbody><tfoot><tr><th>الإجمالي</th><th>٥٠٠</th><th>٥٠٠</th></tr></tfoot></table></div>
						<p>هذا المثال يوضح الأثر المحاسبي. إذا كان الدفع لسداد فاتورة مورد، فسجّله عبر قيد الدفع المرتبط بالفاتورة.</p>
						<div class="ap-cycle-callout"><strong>متى يحدث الترحيل؟</strong><span>حفظ المسودة لا يُنشئ حركة في دفتر الأستاذ. بعد اعتماد القيد، ينشئ ERPNext القيود المحاسبية تلقائيًا.</span></div>
						<div class="ap-cycle-actions"><a href="/app/journal-entry/view/List">افتح القيود اليومية</a></div>
					</section>

					<section id="ap-cycle-ledger" class="ap-cycle-section">
						<div class="ap-cycle-section-head"><span>٢</span><div><p>من أين جاء الرصيد؟</p><h2>تتبّع الأثر في دفتر الأستاذ</h2></div></div>
						<p>يعرض <strong>دفتر الأستاذ العام</strong> السطور التي وُلدت من المستندات المعتمدة. في مثالنا سترى سطرًا مدينًا لمصروف الصيانة وسطرًا دائنًا للبنك، وكل سطر مرتبط برقم القيد وتاريخه.</p>
						<p>اختر الشركة والفترة والحساب، ثم افتح رقم المستند لمعرفة سبب الحركة. إذا أردت كل سطر، اختر عرضًا غير مجمّع؛ فالعرض «المجمّع حسب المستند» قد يخفي تفصيل السطور في النتيجة المرئية دون حذفها.</p>
						<div class="ap-cycle-actions"><a href="/app/query-report/General%20Ledger">افتح دفتر الأستاذ العام</a></div>
					</section>

					<section id="ap-cycle-trial" class="ap-cycle-section">
						<div class="ap-cycle-section-head"><span>٣</span><div><p>هل الأرصدة متوازنة؟</p><h2>افحص ميزان المراجعة</h2></div></div>
						<p>يجمع <strong>ميزان المراجعة</strong> الأرصدة حسب الحساب، ويعرض الرصيد الافتتاحي وحركة الفترة والرصيد الختامي. بعد قيد الصيانة: زاد مصروف الصيانة مدينًا ٥٠٠، ونقص رصيد البنك ٥٠٠.</p>
						<p>يجب أن يتساوى مجموع المدين والدائن. لكن التساوي وحده <strong>لا يثبت صحة التصنيف</strong>؛ فقد يكون القيد متوازنًا على حساب خاطئ. ارجع إلى دفتر الأستاذ والمستند الأصلي إذا وجدت رصيدًا غير منطقي.</p>
						<div class="ap-cycle-actions"><a href="/app/query-report/Trial%20Balance">افتح ميزان المراجعة</a></div>
					</section>

					<section id="ap-cycle-reconcile" class="ap-cycle-section">
						<div class="ap-cycle-section-head"><span>٤</span><div><p>قبل إصدار القوائم</p><h2>طابق الأرصدة ثم سجّل التسويات</h2></div></div>
						<p>ميزان المراجعة المتوازن هو <strong>بداية الفحص، لا نهايته</strong>. قارِن الرصيد بمصدر مستقل، وافهم الفرق، ثم أصلح السبب بمستند مناسب ومعتمد. لا تسجّل قيدًا لمجرد إجبار رقمين على التساوي.</p>
						<div class="ap-cycle-audit-grid">
							<article><span>١ · البنك</span><h3>طابق مع كشف البنك</h3><p>قارن كل حساب بنكي بكشفه حتى تاريخ الفترة. ميّز العمليات غير المحصّلة عن الرسوم أو الحركات التي لم تُسجّل أصلًا.</p><a href="/app/bank-reconciliation-tool">افتح أداة مطابقة البنك</a></article>
							<article><span>٢ · العملاء والموردون</span><h3>راجع المستحقات</h3><p>طابق الذمم مع الفواتير والمدفوعات. دفعة مسجّلة دون ربطها بالفاتورة قد تُبقيها ظاهرة كمبلغ مستحق.</p><a href="/app/payment-reconciliation">افتح مطابقة الدفعات</a></article>
							<article><span>٣ · المخزون والأصول</span><h3>راجع الموجود فعليًا</h3><p>قارن كميات المخزون وقيمته بالعد الفعلي، وتحقق من إهلاك الأصول الذي يخص الفترة إن كانت الشركة تستخدمهما.</p><a href="/app/stock-reconciliation">افتح مطابقة المخزون</a></article>
							<article><span>٤ · التسويات</span><h3>أثبت ما يخص الفترة</h3><p>راجع الضرائب والمصروفات والإيرادات المستحقة أو المؤجلة. اعتمد التصحيح المناسب ثم أعد تشغيل ميزان المراجعة.</p><a href="/app/query-report/Trial%20Balance">أعد فحص ميزان المراجعة</a></article>
						</div>
						<div class="ap-cycle-ledger-example"><p>مثال تدريبي: كشف البنك يتضمن رسمًا قدره ٢٠ ريالًا لم يظهر في الدفاتر</p><table><thead><tr><th>بعد التحقق من المستند</th><th>مدين</th><th>دائن</th></tr></thead><tbody><tr><td>مصروف رسوم بنكية</td><td>٢٠</td><td>—</td></tr><tr><td>البنك</td><td>—</td><td>٢٠</td></tr></tbody><tfoot><tr><th>أثر القيد</th><th>زيادة المصروف</th><th>نقص البنك</th></tr></tfoot></table></div>
						<p>هذا مثال توضيحي فقط؛ اختر الحساب والضريبة والمعالجة حسب المستند ودليل حسابات شركتك. بعد اعتماد التسوية، افحص <strong>ميزان المراجعة المُعدّل</strong>، ثم افتح قائمة الدخل والميزانية بنفس الشركة والفترة والدفتر المالي والأبعاد.</p>

						<div id="ap-cycle-checkup" class="ap-cycle-checkup">
							<div class="ap-cycle-checkup-head"><div><span>اختبار عملي · للقراءة فقط</span><h3>ما الخطوة التالية لشركتك؟</h3><p>اختر الشركة والفترة، واقرأ المؤشرات المتاحة، ثم أجب عمّا راجعته بنفسك. ستحصل على قائمة خطوات تناسب إجاباتك.</p></div><strong aria-hidden="true">✓</strong></div>
							<div class="ap-cycle-checkup-scope">
								<label>الشركة<select data-ap-checkup-company><option value="">اختر الشركة</option></select></label>
								<label>من تاريخ<input data-ap-checkup-from type="date"></label>
								<label>إلى تاريخ<input data-ap-checkup-to type="date"></label>
								<button type="button" class="ap-cycle-checkup-fetch" data-ap-checkup-fetch>اقرأ مؤشرات الفترة</button>
							</div>
							<p class="ap-cycle-checkup-privacy">تُقرأ أعداد محدودة من سجلات ERPNext التي يحق لك عرضها؛ لا تُنشأ قيود ولا تُحفظ إجابات الاختبار. عدم ظهور استثناءات آلية لا يثبت صحة الأرصدة.</p>
							<div class="ap-cycle-checkup-signals" data-ap-checkup-signals aria-live="polite">اختر شركة وفترة لعرض المؤشرات، أو ابدأ بالإجابة يدويًا.</div>
							<div class="ap-cycle-checkup-totals"><p>من ميزان المراجعة المُعدّل · اختياري</p><label>إجمالي المدين<input type="text" inputmode="decimal" data-ap-checkup-debit placeholder="0.00"></label><label>إجمالي الدائن<input type="text" inputmode="decimal" data-ap-checkup-credit placeholder="0.00"></label><small>نقارن المجموعين فقط. تساويهما لا يعني أن الحسابات صُنفت بشكل صحيح.</small></div>
							<div class="ap-cycle-checkup-questions" data-ap-checkup-questions></div>
							<div class="ap-cycle-checkup-result" data-ap-checkup-result aria-live="polite"></div>
						</div>
						<div class="ap-cycle-callout"><strong>بعد الاختبار: وثّق المراجعة</strong><span>افتح ملف مراجعة الإقفال لكل شركة وفترة لتسجيل الفروق ودلائل معالجتها ومسؤولها، ثم أرفق التقارير وأرسلها لمراجع مستقل. الملف لا ينشئ قيد إقفال.</span></div>
						<div class="ap-cycle-actions"><a href="/app/arabic-pro-closing-file">افتح ملفات مراجعة الإقفال</a></div>
					</section>

					<section id="ap-cycle-statements" class="ap-cycle-section">
						<div class="ap-cycle-section-head"><span>٥</span><div><p>تقريران يجيبان عن سؤالين مختلفين</p><h2>أعدّ قائمة الدخل والميزانية العمومية</h2></div></div>
						<div class="ap-cycle-two-reports">
							<article><span>خلال فترة</span><h3>قائمة الدخل</h3><p>تجمع الإيرادات والمصروفات لتبيّن الربح أو الخسارة. مصروف الصيانة ٥٠٠ في مثالنا يخفض نتيجة الفترة بمقدار ٥٠٠.</p><a href="/app/query-report/Profit%20and%20Loss%20Statement">افتح قائمة الدخل</a></article>
							<article><span>في تاريخ محدد</span><h3>الميزانية العمومية</h3><p>تعرض الأصول والالتزامات وحقوق الملكية. في مثالنا ينخفض البنك ٥٠٠؛ وتنعكس خسارة الفترة في حقوق الملكية أو الربح المؤقت بحسب حالة الإقفال.</p><a href="/app/query-report/Balance%20Sheet">افتح الميزانية العمومية</a></article>
						</div>
						<p>عند المقارنة، طابق <strong>الشركة وتاريخ نهاية التقريرين</strong> وسنتهما المالية. لا تضف مركز تكلفة أو دفترًا ماليًا في تقرير وتتركه في الآخر. إذا ظهر الحساب في قسم غير صحيح، راجع نوع الجذر ونوع التقرير في دليل الحسابات بدل تعديل الأرقام يدويًا.</p>
					</section>

					<section id="ap-cycle-close" class="ap-cycle-section">
						<div class="ap-cycle-section-head"><span>٦</span><div><p>بعد المراجعة والاعتماد</p><h2>أقفل النتيجة، لا تاريخ الحركات</h2></div></div>
						<ol class="ap-cycle-steps"><li>أكمل تسويات البنك والذمم والمخزون والإهلاك والضرائب والقيود التصحيحية المعتمدة.</li><li>راجع ميزان المراجعة ودفتر الأستاذ وقائمة الدخل والميزانية. طابق الحسابات المهمة مع مستنداتها.</li><li>خذ نسخة احتياطية، وحدد حساب إقفال الأرباح أو الخسائر ضمن حقوق الملكية وفق سياستك المحاسبية.</li><li>أنشئ <strong>قيد إقفال الفترة (Period Closing Voucher)</strong> للشركة والسنة المالية وتاريخ نهاية الفترة، راجعه ثم اعتمده.</li><li>إذا أردت منع القيود اللاحقة على الفترة، استخدم «الفترة المحاسبية» أو تاريخ تجميد الحسابات بصلاحيات محددة.</li></ol>
						<div class="ap-cycle-callout"><strong>ماذا ينقل قيد الإقفال؟</strong><span>ينقل صافي الإيرادات والمصروفات إلى حساب حقوق الملكية المحدد. لا يُصفّر البنك أو العملاء أو الموردين أو الأصول. قيد الإقفال وحده لا يمنع القيود المؤرخة في الفترة المقفلة.</span></div>
						<p>إذا أُدخل تعديل معتمد بعد الإقفال، راجع أثره وقد تحتاج إلى قيد إقفال إضافي للرصيد المتبقي. لا تُنشئ قيدًا افتتاحيًا يدويًا كل سنة؛ أرصدة الميزانية تُرحّل إلى السنة التالية عبر دفتر الأستاذ. القيد الافتتاحي مخصص عادةً للانتقال الأول من نظام سابق.</p>
						<div class="ap-cycle-actions"><a href="/app/period-closing-voucher/view/List">افتح قيود إقفال الفترة</a><a href="/app/accounting-period/view/List">راجع الفترة المحاسبية</a></div>
					</section>

					<section id="ap-cycle-questions" class="ap-cycle-section">
						<div class="ap-cycle-section-head"><span>؟</span><div><p>قبل أن تعتمد الأرقام</p><h2>أسئلة تتكرر أثناء العمل</h2></div></div>
						<details><summary>هل أُدخل كل عملية بقيد يومية؟</summary><p>لا. استخدم فاتورة البيع والشراء وقيد الدفع والمعاملات المتخصصة للعمليات المعتادة؛ فهي تحفظ بيانات الطرف والمخزون والضريبة والمطابقة. استخدم قيد اليومية للتسويات التي تحتاجه.</p></details>
						<details><summary>لماذا لا يظهر قيدي في دفتر الأستاذ؟</summary><p>تأكد أنه معتمد لا مسودة، ثم طابق الشركة وتاريخ الترحيل والحساب والمرشحات. إذا كان الاعتماد يُعالج في الخلفية، انتظر اكتماله.</p></details>
						<details><summary>هل ميزان المراجعة المتوازن يعني أن كل شيء صحيح؟</summary><p>لا. يثبت تساوي المدين والدائن فقط. راجع تصنيف الحسابات والأرصدة غير المعتادة والمستندات المؤيدة.</p></details>
						<details><summary>هل إنشاء سنة مالية جديدة يقفل السنة السابقة؟</summary><p>لا. السنة المالية تحدد حدود التواريخ. الإقفال يتطلب مراجعة ثم قيد إقفال الفترة، والتجميد إجراء منفصل إذا لزم.</p></details>
						<details><summary>لماذا يختلف مبلغ بين تقريرين؟</summary><p>قارن الشركة والفترة والدفتر المالي والعملة ومراكز التكلفة وطريقة احتساب قيود الإقفال. ثم تتبع الحساب في دفتر الأستاذ.</p></details>
					</section>

					<footer class="ap-cycle-sources"><h2>المراجع الرسمية</h2><p>هذا شرح تدريبي مبسط. اتبع سياسات شركتك ومتطلبات المراجع المحاسبي عند الإقفال والتصنيف.</p><div>
						<a href="https://docs.frappe.io/erpnext/journal-entry" target="_blank" rel="noopener noreferrer">قيد اليومية ↗</a>
						<a href="https://docs.frappe.io/erpnext/general-ledger" target="_blank" rel="noopener noreferrer">دفتر الأستاذ ↗</a>
						<a href="https://docs.frappe.io/erpnext/accounting-reports" target="_blank" rel="noopener noreferrer">التقارير المالية ↗</a>
						<a href="https://docs.frappe.io/erpnext/bank-reconciliation" target="_blank" rel="noopener noreferrer">مطابقة البنك ↗</a>
						<a href="https://docs.frappe.io/erpnext/payment-reconciliation" target="_blank" rel="noopener noreferrer">مطابقة الدفعات ↗</a>
						<a href="https://docs.frappe.io/erpnext/stock-reconciliation" target="_blank" rel="noopener noreferrer">مطابقة المخزون ↗</a>
						<a href="https://docs.frappe.io/erpnext/profit-and-loss-report" target="_blank" rel="noopener noreferrer">قائمة الدخل ↗</a>
						<a href="https://docs.frappe.io/erpnext/balance-sheet" target="_blank" rel="noopener noreferrer">الميزانية العمومية ↗</a>
						<a href="https://docs.frappe.io/erpnext/period-closing-voucher" target="_blank" rel="noopener noreferrer">قيد إقفال الفترة ↗</a>
					</div></footer>
				</div>
			</div>
		</main>
	`);

	page.main.on("click", "[data-ap-cycle-target]", function () {
		const section = page.main[0].querySelector(`#${this.dataset.apCycleTarget}`);
		if (section) {
			section.scrollIntoView({
				behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
				block: "start",
			});
		}
	});

	mountAccountingCheckup(page.main);
};

const AP_CHECKUP_QUESTIONS = [
	{ key: "submitted", text: "هل اعتمدت المستندات والتسويات التي تخص هذه الفترة؟", action: "راجع المستندات غير المعتمدة، ثم اعتمد الصحيح منها بعد مراجعته.", link: "/app/journal-entry", label: "افتح القيود اليومية" },
	{ key: "bank", text: "هل طابقت كل حساب بنكي مع كشف البنك الفعلي؟", action: "طابق كشف كل بنك مع الحركات في ERPNext، وافهم الفروق قبل أي قيد تصحيح.", link: "/app/bank-reconciliation-tool", label: "افتح مطابقة البنك", na: true },
	{ key: "parties", text: "هل راجعت فواتير العملاء والموردين والدفعات غير المخصصة؟", action: "راجع تقارير الذمم، واربط الدفعات بالفواتير الصحيحة دون تسجيل حركة بنكية ثانية.", link: "/app/payment-reconciliation", label: "افتح مطابقة الدفعات", na: true },
	{ key: "stock", text: "هل راجعت المخزون الفعلي وقيمته والأصول وإهلاكها إن وجدت؟", action: "قارن المخزون بالعد الفعلي، وتحقق من إهلاك الأصول قبل إصدار القوائم.", link: "/app/stock-reconciliation", label: "افتح مطابقة المخزون", na: true },
	{ key: "adjustments", text: "هل راجعت الضرائب والاستحقاقات والمبالغ المؤجلة وسجلت التسويات اللازمة؟", action: "حدد ما يخص الفترة من الضرائب والاستحقاقات والمبالغ المؤجلة، ثم اعتمد تسوياته بمستندات مؤيدة.", link: "/app/journal-entry", label: "افتح القيود اليومية" },
	{ key: "trial", text: "هل أعدت ميزان المراجعة بعد التسويات وفحصت الحسابات غير المعتادة؟", action: "أعد تشغيل ميزان المراجعة، ثم افتح الحسابات غير المنطقية في دفتر الأستاذ وتتبّع مستنداتها.", link: "/app/query-report/Trial%20Balance", label: "افتح ميزان المراجعة" },
	{ key: "reports", text: "هل قارنت القوائم بالميزان المُعدّل بنفس الشركة والفترة والفلاتر؟", action: "افتح قائمة الدخل والميزانية بنفس الشركة والفترة والدفتر المالي والأبعاد، وفسّر أي فرق.", link: "/app/query-report/Profit%20and%20Loss%20Statement", label: "افتح قائمة الدخل" },
];

function parseCheckupAmount(value) {
	const digits = "٠١٢٣٤٥٦٧٨٩";
	const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
	const normalized = String(value || "").trim()
		.replace(/[٠-٩]/g, (digit) => String(digits.indexOf(digit)))
		.replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
		.replace(/[٬,\s]/g, "").replace(/٫/g, ".");
	if (!normalized) return null;
	return /^\d+(?:\.\d+)?$/.test(normalized) ? Number(normalized) : Number.NaN;
}

function mountAccountingCheckup($main) {
	const $checkup = $main.find("#ap-cycle-checkup");
	if (!$checkup.length) return;
	const $questions = $checkup.find("[data-ap-checkup-questions]");
	const $signals = $checkup.find("[data-ap-checkup-signals]");
	const $result = $checkup.find("[data-ap-checkup-result]");
	const $company = $checkup.find("[data-ap-checkup-company]");
	const $from = $checkup.find("[data-ap-checkup-from]");
	const $to = $checkup.find("[data-ap-checkup-to]");
	let periodSignals = null;

	const today = frappe.datetime.get_today();
	$from.val(`${today.slice(0, 4)}-01-01`);
	$to.val(today);
	$questions.html(AP_CHECKUP_QUESTIONS.map((question, index) => {
		const options = [["yes", "نعم"], ["no", "ليس بعد"], ["unknown", "لست متأكدًا"]];
		if (question.na) options.push(["na", "لا ينطبق"]);
		return `<fieldset class="ap-cycle-checkup-question"><legend><b>${index + 1}</b>${question.text}</legend><div class="ap-cycle-checkup-choices">${options.map(([value, label]) => `<label><input type="radio" name="ap-checkup-${question.key}" value="${value}"><span>${label}</span></label>`).join("")}</div></fieldset>`;
	}).join(""));

	function renderSignals() {
		if (!periodSignals) return;
		$signals.addClass("is-loaded");
		const definitions = [
			["draft_journals", "قيود يومية مسودة"],
			["unreconciled_bank_transactions", "معاملات بنك غير مطابقة"],
			["unallocated_payments", "دفعات غير مخصصة"],
			["covering_closing_vouchers", "قيود إقفال تغطي الفترة"],
		];
		$signals.html(definitions.map(([key, label]) => {
			const signal = periodSignals[key];
			const value = signal && signal.available ? Number(signal.count || 0).toLocaleString("ar") : "—";
			const hint = signal && signal.available ? "ضمن السجلات المتاحة" : "لا تملك صلاحية عرضها";
			return `<div class="ap-cycle-checkup-signal"><strong>${value}</strong><span>${label}</span><small>${hint}</small></div>`;
		}).join(""));
	}

	function renderResult() {
		const actions = [];
		let answered = 0;
		AP_CHECKUP_QUESTIONS.forEach((question) => {
			const answer = $checkup.find(`input[name="ap-checkup-${question.key}"]:checked`).val();
			if (answer) answered += 1;
			if (answer === "no" || answer === "unknown") {
				actions.push({ text: answer === "unknown" ? `تحقق أولًا: ${question.action}` : question.action, link: question.link, label: question.label });
			}
		});

		const debit = parseCheckupAmount($checkup.find("[data-ap-checkup-debit]").val());
		const credit = parseCheckupAmount($checkup.find("[data-ap-checkup-credit]").val());
		let totalsChecked = false;
		if (Number.isNaN(debit) || Number.isNaN(credit)) {
			actions.unshift({ text: "أدخل مجموعي المدين والدائن بأرقام صحيحة وبالعملة نفسها." });
		} else if ((debit === null) !== (credit === null)) {
			actions.unshift({ text: "أدخل مجموع المدين ومجموع الدائن معًا حتى يمكن المقارنة." });
		} else if (debit !== null && credit !== null) {
			totalsChecked = true;
			if (Math.abs(debit - credit) > 0.01) {
				actions.unshift({ text: `ميزان المراجعة لا يتساوى؛ الفرق ${Math.abs(debit - credit).toLocaleString("ar", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. راجع فلاتر التقرير والقيود قبل القوائم.`, link: "/app/query-report/Trial%20Balance", label: "افتح ميزان المراجعة" });
			}
		}

		if (periodSignals) {
			if (periodSignals.draft_journals?.available && periodSignals.draft_journals.count > 0) {
				actions.push({ text: "توجد قيود يومية مسودة في الفترة. تحقق هل تخص القوائم قبل الاعتماد أو الاستبعاد.", link: "/app/journal-entry", label: "راجع المسودات" });
			}
			if (periodSignals.unreconciled_bank_transactions?.available && periodSignals.unreconciled_bank_transactions.count > 0) {
				actions.push({ text: "توجد معاملات بنك مستوردة لم تُطابق بعد. راجعها مع الكشف والمستندات.", link: "/app/bank-reconciliation-tool", label: "راجع معاملات البنك" });
			}
			if (periodSignals.unallocated_payments?.available && periodSignals.unallocated_payments.count > 0) {
				actions.push({ text: "توجد دفعات غير مخصصة في الفترة. تحقق هل هي سلف مقصودة أم يجب ربطها بفواتير.", link: "/app/payment-reconciliation", label: "راجع الدفعات" });
			}
		}

		const remaining = AP_CHECKUP_QUESTIONS.length - answered;
		const heading = actions.length ? "خطوات تحتاج انتباهك" : remaining ? "أكمل تقييم الفترة" : "يمكنك متابعة مراجعة القوائم";
		const intro = actions.length ? "ابدأ بالأعلى أثرًا ثم أعد الاختبار بعد التصحيح." : remaining ? `أجبت عن ${answered} من ${AP_CHECKUP_QUESTIONS.length} أسئلة. أكمل البقية لتحديد الخطوة التالية.` : "لم تُظهر إجاباتك استثناءً واضحًا. راجع المستندات الأصلية قبل اعتماد القوائم أو الإقفال.";
		const extra = !periodSignals ? "لم تُقرأ مؤشرات ERPNext بعد؛ النتيجة مبنية على إجاباتك فقط." : !totalsChecked ? "أدخل مجموعي ميزان المراجعة إذا أردت مقارنة رقمية إضافية." : "تساوي المجموعين لا يثبت صحة تصنيف الحسابات.";
		$result.html(`<div class="ap-cycle-checkup-result-head"><span>نتيجة إرشادية</span><h4>${heading}</h4><p>${intro}</p></div>${actions.length ? `<ol>${actions.map((action) => `<li><span>${action.text}</span>${action.link ? `<a href="${action.link}">${action.label} ←</a>` : ""}</li>`).join("")}</ol>` : ""}<p class="ap-cycle-checkup-disclaimer">${extra}</p>`);
	}

	$checkup.on("change input", "input[type=radio], [data-ap-checkup-debit], [data-ap-checkup-credit]", renderResult);
	$checkup.on("change", "[data-ap-checkup-company], [data-ap-checkup-from], [data-ap-checkup-to]", function () {
		periodSignals = null;
		$signals.removeClass("is-loaded");
		$signals.text("تغيرت الشركة أو الفترة. اقرأ المؤشرات من جديد لتحديث النتيجة.");
		renderResult();
	});
	$checkup.on("click", "[data-ap-checkup-fetch]", async function () {
		if (!$company.val() || !$from.val() || !$to.val()) {
			$signals.text("اختر الشركة وتاريخي بداية الفترة ونهايتها أولًا.");
			return;
		}
		if ($from.val() > $to.val()) {
			$signals.text("تاريخ البداية يجب أن يسبق تاريخ النهاية.");
			return;
		}
		const requestedScope = { company: $company.val(), from_date: $from.val(), to_date: $to.val() };
		const $button = $(this).prop("disabled", true).text("جارٍ قراءة المؤشرات...");
		try {
			const response = await frappe.call({ method: "arabic_pro.accounting_diagnostic.get_period_signals", args: requestedScope });
			if ($company.val() !== requestedScope.company || $from.val() !== requestedScope.from_date || $to.val() !== requestedScope.to_date) return;
			periodSignals = response.message;
			renderSignals();
			renderResult();
		} catch (error) {
			periodSignals = null;
			$signals.removeClass("is-loaded");
			$signals.text("تعذر قراءة المؤشرات. تحقق من صلاحيات الشركة والفترة، ثم حاول مجددًا. يمكنك إكمال الأسئلة يدويًا.");
			renderResult();
		} finally {
			$button.prop("disabled", false).text("اقرأ مؤشرات الفترة");
		}
	});

	frappe.db.get_list("Company", { fields: ["name"], limit: 200, order_by: "name asc" }).then((companies) => {
		companies.forEach((company) => $company.append(new Option(company.name, company.name)));
		const selected = frappe.defaults?.get_user_default?.("Company");
		if (selected && companies.some((company) => company.name === selected)) $company.val(selected);
	}).catch(() => {
		$signals.text("تعذر عرض الشركات المتاحة. تحقق من صلاحية قراءة الشركة؛ ما زال بإمكانك إكمال الأسئلة يدويًا.");
	});
	renderResult();
}
