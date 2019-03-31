//{{{
#include <bits/stdc++.h>
using namespace std;
//}}}

int main(void){
	long long N;
	cin >> N;
	long long ans = 0;
	ans += 2 * (N / 3);
	ans += 2 * (N / 5);
	printf("%lld\n", ans);
	return 0;
}
