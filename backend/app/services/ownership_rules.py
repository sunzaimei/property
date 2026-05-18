from __future__ import annotations
from app.models.property import PropertyRecord
from app.models.zone import URAZoneRecord
from app.models.ownership import OwnershipRules, ABSDRate

ABSD_RATES_BASE = [
    ABSDRate(buyer_profile="Singapore Citizen — 1st property", rate_percent=0, notes=None),
    ABSDRate(buyer_profile="Singapore Citizen — 2nd property", rate_percent=20, notes=None),
    ABSDRate(buyer_profile="Singapore Citizen — 3rd+ property", rate_percent=30, notes=None),
    ABSDRate(buyer_profile="Permanent Resident — 1st property", rate_percent=5, notes=None),
    ABSDRate(buyer_profile="Permanent Resident — 2nd+ property", rate_percent=30, notes=None),
    ABSDRate(buyer_profile="Foreigner (any property)", rate_percent=60, notes="Effective 27 Apr 2023"),
    ABSDRate(buyer_profile="Entity / Company", rate_percent=65, notes="Additional 10% remittable for housing developers"),
]

BSD_NOTE = (
    "Buyer's Stamp Duty (BSD) applies to all purchases: "
    "1% on first SGD 180K, 2% next SGD 180K, 3% next SGD 640K, 4% next SGD 500K, "
    "5% next SGD 1.5M, 6% remainder. "
    "ABSD rates as of Feb/Apr 2023. Verify with a lawyer before transacting."
)


def compute(property: PropertyRecord, zone: URAZoneRecord | None) -> OwnershipRules:
    prop_type = property.property_type
    is_strata = prop_type == "cluster"
    is_gcb = prop_type == "gcb" or (zone and zone.is_gcba)

    if is_gcb:
        return OwnershipRules(
            sc_eligible=True,
            pr_eligible=False,
            foreigner_eligible=False,
            foreigner_restrictions=(
                "GCB properties are restricted to Singapore Citizens only. "
                "PRs and foreigners are not permitted to purchase, regardless of SLA approval."
            ),
            company_eligible=False,
            absd_rates=ABSD_RATES_BASE,
            bsd_note=BSD_NOTE,
            requires_land_deal_approval=False,
            special_conditions=[
                "Only Singapore Citizens may own GCB properties (since 2012 policy change)",
                "Minimum plot size of 1,400 sqm must be maintained — no subdivision below this threshold",
            ],
        )

    if is_strata:
        return OwnershipRules(
            sc_eligible=True,
            pr_eligible=True,
            foreigner_eligible=True,
            foreigner_restrictions=None,
            company_eligible=True,
            absd_rates=ABSD_RATES_BASE,
            bsd_note=BSD_NOTE,
            requires_land_deal_approval=False,
            special_conditions=[
                "Strata-titled property — foreigners may purchase as land is common property",
                "Subject to Land Titles (Strata) Act for collective sales and MCST governance",
            ],
        )

    # Standard landed (terrace, semi-d, bungalow, conservation) — non-strata
    return OwnershipRules(
        sc_eligible=True,
        pr_eligible=True,
        foreigner_eligible=False,
        foreigner_restrictions=(
            "Foreigners cannot purchase non-strata landed property without prior written approval "
            "from the Singapore Land Authority (SLA) Land Dealings Approval Unit (LDAU). "
            "Approval is discretionary and typically requires exceptional economic contribution. "
            "ABSD of 60% still applies if approval is granted."
        ),
        company_eligible=False,
        absd_rates=ABSD_RATES_BASE,
        bsd_note=BSD_NOTE,
        requires_land_deal_approval=True,
        special_conditions=[
            "PRs with fewer than 5 years of residency may also require SLA LDAU approval",
            "CPF usage for 99-year leasehold properties is restricted based on remaining lease vs buyer age",
        ],
    )
